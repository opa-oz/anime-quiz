import { Difficulty } from '../enums';

export type UserSession = {
    id: string;
    score: number;
    isQuizStarted: boolean;
    isReadyToAnswer: boolean;
    isReadyToNextQuestion: boolean;
    isReadyToExperiment?: boolean;
    isQuizFinished: boolean;
    passedQuestionsCount?: number;
    needToChooseExperiment?: boolean;
    needToChooseDifficulty?: boolean;
    quizDifficulty?: Difficulty;
    questionsRow?: Array<number>;
    rightAnswer?: string | number;
    rightAnswerIndex?: number;
}

export type Session = {
    message_id: number;
    session_id: string;
    skill_id: string;
    user_id: string;
    user?: {
        user_id: string;
        access_token: string;
    };
    application: {
        application_id: string;
    };
    new: boolean;
};

export type SessionState = {
    session: UserSession;
}

export type Version = '1.0';

export type Params = {
    session: Session;
    res: any;
    version: Version;
    session_state: UserSession;
}

type Entity = {
    tokens: {
        start: number;
        end: number;
    },
    type: 'YANDEX.GEO' | 'YANDEX.DATETIME' | 'YANDEX.FIO' | 'YANDEX.NUMBER';
    value: {
        house_number: string;
        street: string;
    }
}

export type Request = {
    command: string;
    original_utterance: string;
    type: string;
    markup: {
        dangerous_context: boolean;
    },
    payload: any;
    nlu: {
        tokens: Array<string>;
        entities: Array<Entity>
    }
}

export type GalleryCard = {
    type: 'ItemsList',
    header?: {
        text: string;
    },
    items: Array<{
        image_id: string;
        title?: string;
        description?: string;
        button?: {
            text?: string;
            url?: string;
            payload: any;
        }
    }>,
    footer?: {
        text: string;
        button?: {
            text?: string;
            url?: string;
            payload: any;
        }
    }
}

export type ImageCard = {
    type: 'BigImage';
    image_id: string;
    title?: string;
    description?: string;
    button?: {
        text?: string;
        url?: string;
        payload: any;
    }
};

export type Response = {
    text: string;
    tts?: string;
    buttons?: Array<Button>,
    end_session?: boolean;
    card?: ImageCard | GalleryCard;
};

export type Button = {
    title: string;
    url?: string;
    payload?: any;
    hide?: boolean;
}
