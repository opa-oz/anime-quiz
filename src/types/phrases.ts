import { Commands } from '../enums';

export type TTSPhrase = {
    text: string;
    tts: string;
}

export type CommandPhrase = {
    text: string;
    command: Commands;
}
