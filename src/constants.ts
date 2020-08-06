import { TTSPhrase } from './types/phrases';
import pickRandomPhrase from './utils/pick-random-phrase';

export const phrases = {
    DEFAULT: [
        (): string => 'Привет! Я Аниме-Алиса и я бросаю тебе вызов! Я буду задавать тебе вопросы об аниме, а ты должен давать правильные ответы!\n Готов?',
    ],
    ERROR: [
        (): string => 'Извините, я не поняла',
    ],
    HELP: [
        (): string => 'Помощь идёт'
    ],
    CHOOSE_DIFFICULTY: [
        (): string => 'Легкая или сложная?'
    ],
    ASK_QUESTION: [
        (question: string, answers: Array<string>): TTSPhrase => {
            const ttsAnswers = answers
                .map((answer, index) => `${index + 1}  ${answer}.`)
                .join(' ')
            const answersToShow = answers
                .map((answer, index) => `${index + 1})  ${answer}`)
                .join('\n')

            return {
                text: `${question}:\n${answersToShow}`,
                tts: `${question}. Варианты ответа: ${ttsAnswers}`
            };
        }
    ],
    EXPERIMENT: [
        (): string => 'Поэкспериментируем?'
    ],
    END: [
        (): string => 'Хорошо, поиграем в другой раз'
    ],
    IDLE: [
        (): string => 'Ничего не поняла, скажи снова',
    ],
    ASK_FOR_MORE: [
        (score: number): string => `Твой финальный счёт: ${score}.Ещё?`
    ],
    NICE_TO_PLAY: [
        (): string => 'Приятно было поиграть! Ещё увидимся!'
    ],
    RIGHT_ANSWER: [
        (): string => 'И это правильный ответ!'
    ],
    WRONG_ANSWER: [
        (rightAnswer: string): string => `Сожалею, Вы ответили не правильно. Правильный ответ: ${rightAnswer}`
    ],
    IS_READY_TO_NEXT: [
        (isRight: boolean, score: number, rightAnswer?: string, isThisLastQuestion?: boolean): string => {
            let prefix;

            if (isRight) {
                prefix = pickRandomPhrase(phrases.RIGHT_ANSWER);
            } else {
                prefix = pickRandomPhrase(phrases.WRONG_ANSWER, [rightAnswer]);
            }

            const scoreText = `\nВаш счёт ${score}`;

            return `${prefix}. ${scoreText}. \nГотовы к ${isThisLastQuestion ? 'последнему' : 'следующему'} вопросу?`;
        }
    ],
    LAST_QUESTION_PASSED: [
        (isRight: boolean, score: number, rightAnswer?: string): string => {
            let prefix;

            if (isRight) {
                prefix = pickRandomPhrase(phrases.RIGHT_ANSWER);
            } else {
                prefix = pickRandomPhrase(phrases.WRONG_ANSWER, [rightAnswer]);
            }

            const scoreText = `Ваш финальный счёт ${score}`;

            return `${prefix}. ${scoreText}.\n Поиграем ещё?`;
        }
    ]
}

export const PING_COMMAND = 'ping';

export const EXPERIMENT_CHANCE = 0.3;
export const EXPERIMENT_ACCURACY = 0.7;

export const MAX_QUESTIONS = 2;

