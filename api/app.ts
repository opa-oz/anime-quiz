import Fuse from 'fuse.js';
import { NowRequest, NowResponse } from '@vercel/node';
import { v4 as uuidV4 } from 'uuid';

import { Params, Request, Response, Session, SessionState, UserSession, Version } from '../src/types/request-params';
import { Question, QuestionsSource } from '../src/types/configs';

import logger from '../src/logger';

import { getResource } from '../src/yaml-manager';
import shortDescription from '../src/utils/short-description';
import pickRandomPhrase from '../src/utils/pick-random-phrase';
import buildButtons from '../src/utils/build-buttons';

import { EXPERIMENT_ACCURACY, EXPERIMENT_CHANCE, MAX_QUESTIONS, phrases, PING_COMMAND } from '../src/constants';
import buildCommandsTree from '../src/commands-builder';
import extractNumber from '../src/utils/extract-number';
import { Commands, Difficulty } from '../src/enums';
import pickRandomItemRange from '../src/utils/pick-random-item-range';
import shuffleArray from '../src/utils/shuffle-array';
import { TTSPhrase } from '../src/types/phrases';

const EASY_QUESTIONS: QuestionsSource = getResource<QuestionsSource>('/questions/easy.yml');
const HARD_QUESTIONS: QuestionsSource = getResource<QuestionsSource>('/questions/hard.yml');

const DEFAULT_SESSION = {
    score: 0,
    isQuizStarted: false,
    isReadyToAnswer: false,
    isReadyToExperiment: false,
    isQuizFinished: false,
} as UserSession;

const commandsTree = buildCommandsTree();

const commandsSearcher = new Fuse(commandsTree, { keys: ['text'], shouldSort: true })

const responseToUser = ({ res, version, session, session_state }: Params, response: Response) => {
    res.end(JSON.stringify({
        version,
        session,
        session_state,
        response: {
            end_session: false,
            ...(response || {}),
            text: shortDescription(response.text, 1024),
            tts: response.tts ? shortDescription(response.tts, 1024) : undefined,
        },
    }));
};

const defaultAnswer = (params: Params) => {
    return responseToUser(params, {
        text: pickRandomPhrase(phrases.DEFAULT) as string,
        buttons: buildButtons(['Готов']),
    })
};

const chooseQuestionsArray = (difficulty: Difficulty) => {
    let source: QuestionsSource;
    switch (difficulty) {
        case Difficulty.EASY:
            source = EASY_QUESTIONS;
            break;
        case Difficulty.HARD:
            source = HARD_QUESTIONS;
            break;
        default:
            return [];
    }

    const { questions } = source;

    return questions.map(({ question }) => question);
}

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
    const {
        request,
        session,
        version,
        state,
    }: {
        session: Session,
        version?: Version,
        request: Request,
        state: SessionState
    } = req.body || {};

    const isStateAvailable = Boolean(state && state.session);
    let userSession: UserSession = {
        // @ts-ignore
        id: uuidV4(),
        ...DEFAULT_SESSION,
    };

    if (isStateAvailable) {
        userSession = { ...userSession, ...state.session };
    }

    const defaultRes = { res, version, session, session_state: userSession } as Params;

    const endWithError = () => {
        logger.error('[ERROR] Sort of error:', JSON.parse(JSON.stringify(userSession)))

        return responseToUser(defaultRes, {
            text: pickRandomPhrase(phrases.ERROR) as string,
            end_session: true
        });
    }

    const endWithMessage = () => {
        return responseToUser(defaultRes, {
            text: pickRandomPhrase(phrases.END) as string,
            end_session: true,
        })
    }

    const idle = (orig) => {
        // @todo: Помощь на каждом шаге

        logger.debug('[IDLE]', orig);

        return responseToUser(defaultRes, {
            text: pickRandomPhrase(phrases.IDLE) as string,
        })
    }

    const askQuestion = (questionId, questionsArray) => {
        const question: Question = questionsArray.find(({ id }) => id === questionId);

        if (!question) {
            return endWithError();
        }

        const { title, answers, right_answer } = question;
        const shuffledAnswers = shuffleArray<string | number>(answers);

        let buttons;

        if (userSession.isReadyToExperiment) {
            buttons = shuffledAnswers.map(a => `${a}`);
        } else {
            buttons = shuffledAnswers.map((_, key) => `${key + 1}`)
        }

        userSession.rightAnswer = right_answer;
        userSession.rightAnswerIndex = shuffledAnswers.findIndex(a => a === right_answer) + 1;

        return responseToUser(defaultRes, {
            ...pickRandomPhrase(phrases.ASK_QUESTION, [title, shuffledAnswers]) as TTSPhrase,
            buttons: buildButtons(buttons)
        })
    }

    const planQuestionsAndStart = () => {
        const questionsArray = chooseQuestionsArray(userSession.quizDifficulty as Difficulty);

        const questionsRow = pickRandomItemRange<Question>(questionsArray, MAX_QUESTIONS).map(v => v.id);

        userSession.score = 0;
        userSession.questionsRow = questionsRow;
        userSession.isReadyToAnswer = true;
        userSession.isQuizStarted = true;
        userSession.isQuizFinished = false;
        userSession.passedQuestionsCount = 1;

        return askQuestion(questionsRow[0], questionsArray);
    }

    const askAboutExperiment = () => {
        return responseToUser(defaultRes, {
            text: pickRandomPhrase(phrases.EXPERIMENT) as string,
            buttons: buildButtons([
                'Давай',
                'Не хочу'
            ])
        })
    }

    const askAboutNext = (isRight: boolean, rightAnswer?: string | number) => {
        userSession.isReadyToNextQuestion = true;
        userSession.isReadyToAnswer = false;

        const isThisLastQuestion = userSession.passedQuestionsCount === MAX_QUESTIONS;

        const { score } = userSession;

        return responseToUser(defaultRes, {
            text: pickRandomPhrase(phrases.IS_READY_TO_NEXT, [isRight, score, rightAnswer, isThisLastQuestion]) as string,
            buttons: buildButtons([
                'Готов', 'Нет'
            ])
        })
    }

    if (request) {
        if (request.original_utterance) {
            const { original_utterance: orig, command } = request;

            if (command === PING_COMMAND || session.new) {
                return defaultAnswer(defaultRes);
            }

            const possibleNumber = extractNumber(command);

            if (userSession.isReadyToAnswer && userSession.isQuizStarted && !userSession.isQuizFinished) {
                const goNext = (isRight: boolean, rightAnswer?: string | number) => {
                    const { passedQuestionsCount } = userSession;

                    if (isRight) {
                        userSession.score += 1;
                    }

                    if (passedQuestionsCount && passedQuestionsCount >= MAX_QUESTIONS) {
                        userSession.isQuizFinished = true;
                        userSession.isReadyToNextQuestion = false;
                        userSession.isReadyToAnswer = false;

                        logger.debug(`[FINAL] score=${userSession.score} | experiment=${userSession.isReadyToExperiment}`);

                        return responseToUser(defaultRes, {
                            text: pickRandomPhrase(phrases.LAST_QUESTION_PASSED, [isRight, userSession.score, rightAnswer]) as string,
                            buttons: buildButtons([
                                'Давай ещё',
                                'Потом'
                            ])
                        })
                    }

                    return askAboutNext(isRight, rightAnswer);
                }

                if (possibleNumber) {
                    // @note: Проверить цифровой ответ
                    const { rightAnswerIndex, rightAnswer } = userSession;

                    logger.debug(`[EXTRACT NUMBER] possible_number=${possibleNumber} | right_answer=${rightAnswer} | right_answer_index=${rightAnswerIndex}`);

                    userSession.rightAnswer = undefined;
                    userSession.rightAnswerIndex = undefined;

                    return goNext(possibleNumber === rightAnswerIndex, rightAnswer)
                }

                if (userSession.isReadyToExperiment) {
                    const { rightAnswer } = userSession;

                    const fakeList = ['FAKE_ZERO', 'FAKE_ONE', rightAnswer, 'FAKE_TWO'];
                    const fuse = new Fuse(fakeList, { includeScore: true, shouldSort: true });
                    const [searchResult] = fuse.search(orig);
                    const { score } = searchResult || {};

                    const isRight = Boolean(typeof score === 'number' && score <= EXPERIMENT_ACCURACY);

                    logger.debug(`[EXPERIMENT] input=${orig} | right_answer=${rightAnswer} | score=${score} | isRight=${isRight}`);

                    userSession.rightAnswer = undefined;
                    userSession.rightAnswerIndex = undefined;

                    return goNext(isRight, rightAnswer)
                }
            }

            const [searchResult] = commandsSearcher.search(orig);
            const { item } = searchResult || {};
            const { command: callToAction } = item || {};

            switch (callToAction) {
                case Commands.AGREE: {
                    if (userSession.isQuizFinished) {
                        // @note Игра закончилась, спросили "Хочешь ещё?" и он согласился
                        defaultRes.session_state = {
                            // @ts-ignore
                            id: uuidV4(),
                            ...DEFAULT_SESSION
                        };

                        return responseToUser(defaultRes, {
                            text: pickRandomPhrase(phrases.CHOOSE_DIFFICULTY) as string,
                            buttons: buildButtons([
                                'Лёгкие',
                                'Сложные'
                            ])
                        })
                    }

                    if (!userSession.isQuizStarted
                        && !userSession.needToChooseExperiment
                        && !userSession.needToChooseDifficulty
                        && !userSession.isQuizFinished) {
                        // @note Положительный ответ на "Готов сыграть?"
                        userSession.needToChooseDifficulty = true;

                        return responseToUser(defaultRes, {
                            text: pickRandomPhrase(phrases.CHOOSE_DIFFICULTY) as string,
                            buttons: buildButtons([
                                'Лёгкие',
                                'Сложные'
                            ])
                        })
                    }

                    if (userSession.needToChooseExperiment) {
                        // @note Согласился на экспериментальное распознавание
                        userSession.needToChooseExperiment = false;
                        userSession.isReadyToExperiment = true;

                        return planQuestionsAndStart();
                    }

                    if (userSession.isQuizStarted && userSession.isReadyToNextQuestion) {
                        // @note Согласен на следующий вопрос
                        userSession.isReadyToNextQuestion = false;
                        userSession.isReadyToAnswer = true;
                        userSession.passedQuestionsCount = (userSession.passedQuestionsCount || 0) + 1;

                        const questionsArray = chooseQuestionsArray(userSession.quizDifficulty as Difficulty);
                        const { questionsRow = [], passedQuestionsCount } = userSession;

                        return askQuestion(questionsRow[passedQuestionsCount - 1], questionsArray);
                    }

                    return idle(orig);
                }
                case Commands.DISAGREE: {
                    if (userSession.isQuizFinished) {
                        // @note Предложили поиграть ещё раз - отказался
                        defaultRes.session_state = {
                            // @ts-ignore
                            id: uuidV4(),
                            ...DEFAULT_SESSION,
                        };

                        return responseToUser(defaultRes, {
                            text: pickRandomPhrase(phrases.NICE_TO_PLAY) as string,
                            end_session: true,
                        })
                    }

                    if (!userSession.isQuizStarted && userSession.needToChooseExperiment) {
                        // @note Отказался поучаствовать в эксперименте
                        userSession.needToChooseExperiment = false;
                        userSession.isReadyToExperiment = false;

                        return planQuestionsAndStart();
                    }

                    if (userSession.isQuizStarted && userSession.isReadyToNextQuestion) {
                        userSession.isQuizFinished = true;
                        userSession.isReadyToNextQuestion = false;

                        return responseToUser(defaultRes, {
                            text: pickRandomPhrase(phrases.ASK_FOR_MORE, [userSession.score]) as string,
                            buttons: buildButtons([
                                'Давай',
                                'Потом'
                            ])
                        })
                    }

                    if (!userSession.isQuizStarted && !userSession.needToChooseDifficulty) {
                        // @note Не готов играть
                        return endWithMessage();
                    }

                    return idle(orig);
                }
                case Commands.EASY: {
                    userSession.needToChooseDifficulty = false;
                    userSession.quizDifficulty = Difficulty.EASY;
                    userSession.needToChooseExperiment = Math.random() <= EXPERIMENT_CHANCE;

                    if (!userSession.needToChooseExperiment) {
                        // @note Лёгкая сложность, поехали
                        return planQuestionsAndStart();
                    }

                    // @note Спрашиваем об эксперименте
                    return askAboutExperiment();
                }
                case Commands.HARD: {
                    userSession.needToChooseDifficulty = false;
                    userSession.quizDifficulty = Difficulty.HARD;
                    userSession.needToChooseExperiment = Math.random() <= EXPERIMENT_CHANCE;

                    if (!userSession.needToChooseExperiment) {
                        // @note Тяжёлая сложность, поехали
                        return planQuestionsAndStart();
                    }

                    // @note Спрашиваем об эксперименте
                    return askAboutExperiment()
                }
                case Commands.HELP: {
                    // @note Помогаем пользователю
                    defaultRes.session_state = {
                        // @ts-ignore
                        id: uuidV4(),
                        ...DEFAULT_SESSION,
                    }

                    return responseToUser(defaultRes, {
                        text: pickRandomPhrase(phrases.HELP) as string,
                        end_session: true,
                    });
                }
                default:
                    return idle(orig);
            }
        }
    }

    return defaultAnswer(defaultRes);
}
