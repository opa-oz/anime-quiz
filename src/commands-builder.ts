import { Commands } from './enums';
import { CommandPhrase } from './types/phrases';

const COMMANDS = [
    {
        command: Commands.AGREE,
        answers: [
            'да',
            'готов',
            'давай',
            'ещё',
            'еще',
            'еще раз',
            'ага',
            'поиграем',
            'начнём',
            'начнем'
        ]
    },
    {
        command: Commands.DISAGREE,
        answers: [
            'нет',
            'не хочу',
            'обойдёшься',
            'обойдешься',
            'хватит',
            'потом'
        ]
    },
    {
        command: Commands.EASY,
        answers: [
            'лёгкая',
            'легко',
            'простая',
            'просто'
        ]
    },
    {
        command: Commands.HARD,
        answers: [
            'сложно',
            'сложная',
            'сложнее'
        ]
    },
    {
        command: Commands.HELP,
        answers: [
            'помощь',
            'помоги',
            'что ты умеешь'
        ]
    }
];

export default function buildCommandsTree(): Array<CommandPhrase> {
    return COMMANDS.reduce((accumulator, value) => {
        const { command, answers } = value;

        return [
            ...accumulator,
            ...answers.map(text => ({ text, command }))
        ];
    }, []) as Array<CommandPhrase>;
}
