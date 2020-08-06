export default function pickRandomItem<T>(array: Array<T>): T {
    return array[Math.floor(Math.random() * array.length)]
}
