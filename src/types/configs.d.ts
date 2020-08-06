export type Question = {
    id: number;
    title: string;
    right_answer: string | number;
    answers: Array<string | number>
}

export type QuestionsSource = {
    difficulty: string;
    questions: Array<{
        question: Question
    }>
}
