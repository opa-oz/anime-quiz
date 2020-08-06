import pickRandomItem from './pick-random-item';

export default function pickRandomItemRange<T>(array: Array<T>, count: number): Array<T> {
    const result: Array<T> = [];
    let tmpArray = [...array];

    for (let i = 0; i < count; i++) {
        const item = pickRandomItem(tmpArray);
        tmpArray = tmpArray.filter((v) => v !== item);

        result.push(item);
    }

    return result;
}
