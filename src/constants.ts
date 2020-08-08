import { TTSPhrase } from './types/phrases';
import pickRandomPhrase from './utils/pick-random-phrase';

export const phrases = {
    DEFAULT: [
        (): string => 'Я аниме-Алиса и я бросаю вам вызов! Я буду задавать вопросы об аниме, а вы должен давать правильные ответы!\n Готовы?',
        (): string => 'Я аниме-Алиса и я очень люблю задавать вопросы! Давайте поиграем? \nЯ буду спрашивать что-то про аниме и давать варианты ответов, а Вы - правильно отвечать и хорошо проводить время. \n Начнём?',
        (): string => 'Заскучали? Может устроим небольшой квиз по аниме? У меня есть вопросы и варианты ответов и я готова обменять их на ваши ответы.\n Поиграем?',
        (): string => 'Люблю аниме. А еще больше люблю викторины про аниме! У меня тут есть одна, как раз. \n Попробуем?',
    ],
    ERROR: [
        (): string => 'Извините, я не поняла, что мне нужно сделать. \n Я могу задавать вопросы, и проверять ваши ответы. Готовы ответить на парочку?',
        (): string => 'Программист Алексей очень извиняется, так как не научил меня ответу на Вашу предыдущую фразу. \nМожет лучше поиграем?',
        (): string => 'Простите меня, семпай, но я не могу ответить на это. \n Как насчёт аниме квиза?',
        (): string => 'Гомэн насай, сенсей, я не справилась. Могу я, в качестве извинений, развлечь вас аниме квизом?',
    ],
    HELP: [
        (): string => 'Я буду задавать вопросы, связанные с аниме, и предлагать варианты ответов. Вы будете отвечать на них правильно и повышать свой счёт. \n Ну не круто ли? Начнём?',
        (): string => 'Я аниме-Алиса! Я ведущий викторины про аниме. Если хотите поучаствовать, выберите сложность и мы начнём! Я буду задавать вопросы и давать варианты ответов, а вы отвечать, называя номер ответа. \n Поехали?'
    ],
    CHOOSE_DIFFICULTY: [
        (): string => `Всего в викторине ${MAX_QUESTIONS} вопросов. Для каждого из них есть 4 варианта ответа. Назовите номер варианта, который вам кажется верный и я скажу - правы ли вы.\n У меня есть легкие и сложные вопросы, какие выбираете?`,
        (): string => `Всего будет ${MAX_QUESTIONS} вопросов и по 4 варианта ответа на каждый. Вам остаётся лишь назвать номер варианта! \n Хотите лёгкие или сложные вопросы?`
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
        (): string => 'Как и любой нейросети, мне надо учиться. Но без вашей помощи мне не обойтись.\n Обычно я обрабатываю ваши ответы-цифры, но могу попробовать понимать прямые ответы. Попробуем?',
        (): string => 'Я немного глупенькая и поэтому могу понимать ответы только в виде чисел. НО! Я стараюсь научиться понимать словесные ответы. Это пока эксперимент, так что не расстраивайтесь, если финальный счёт пострадает из-за этого. \n Попробуем ответы словами?',
        (): string => 'Разработчик Алексей пытается научить меня быть более человечной. Я могу попробовать распознавать ваши прямые ответы, а не бесчувственные номера ответов. \nПоможете Алексею научить меня?'
    ],
    END: [
        (): string => 'Хорошо, поиграем в другой раз!',
        (): string => 'Приходите чаще! Я люблю викторины',
        (): string => 'Как только будете готовы - давайте поиграем!',
    ],
    IDLE: [
        (): string => 'К сожалению, я не поняла. Попробуйте, пожалуйста, перефразировать ответ',
    ],
    FINAL_PHRASES: [
        (): string => 'Ну не круто ли?!',
        (): string => 'Не знаю как вам, а мне понравилось!',
        (): string => 'Ух, хорошо поотгадывали!',
    ],
    MORE: [
        (): string => 'Поиграем ещё?',
        (): string => 'Еще разок?',
        (): string => 'Давайте сыграем ещё раз?',
    ],
    ASK_FOR_MORE: [
        (score: number): string => `Ваш финальный счёт: ${score}.\n ${pickRandomPhrase(phrases.FINAL_PHRASES)} \n ${pickRandomPhrase(phrases.MORE)}`,
        (score: number): string => `Ииии ваш счёт: ${score}.\n ${pickRandomPhrase(phrases.FINAL_PHRASES)} \n ${pickRandomPhrase(phrases.MORE)}`,
        (score: number): string => `Произведя сложные математические вычисления, я поняла, что ваш счёт: ${score}.\n ${pickRandomPhrase(phrases.FINAL_PHRASES)} \n ${pickRandomPhrase(phrases.MORE)}`,
    ],
    NICE_TO_PLAY: [
        (): string => 'Приятно было поиграть! Надеюсь, ещё увидимся!',
        (): string => 'А вы - достойный соперник! Надеюсь, как нибудь повторим!',
        (): string => 'Мне всё понравилось, надеюсь, вам тоже!'
    ],
    RIGHT_ANSWER: [
        (): string => 'И это правильный ответ!',
        (): string => 'И вы правы!',
        (): string => 'А что, астрологи объявили месяц правильных ответов? Потому что ваш именно такой!',
    ],
    WRONG_ANSWER: [
        (rightAnswer: string): string => `Сожалею, Вы ответили не правильно. Правильный ответ: ${rightAnswer}\n`,
        (rightAnswer: string): string => `И это... Не правильный ответ... Правильный: ${rightAnswer}\n`,
        (rightAnswer: string): string => `Увы, не угадали... Правильный ответ: ${rightAnswer}\n`,
        (rightAnswer: string): string => `Вы были близко, но недостаточно близко... Правильный ответ: ${rightAnswer}\n`,
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

            return `${prefix} ${scoreText} \nГотовы к ${isThisLastQuestion ? 'последнему' : 'следующему'} вопросу?`;
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

            return `${prefix} ${pickRandomPhrase(phrases.ASK_FOR_MORE, [score])}`;
        }
    ]
}

export const PING_COMMAND = 'ping';

export const EXPERIMENT_CHANCE = 0.3;
export const EXPERIMENT_ACCURACY = 0.7;

export const MAX_QUESTIONS = 5;

