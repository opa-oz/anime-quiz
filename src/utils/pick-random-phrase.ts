import pickRandomItem from './pick-random-item';
import { TTSPhrase } from '../types/phrases';

// eslint-disable-next-line @typescript-eslint/ban-types
export default function pickRandomPhrase(list: Array<Function>, params?: Array<unknown>): string | TTSPhrase {
    const randomPhraseBuilder = pickRandomItem(list);

    return randomPhraseBuilder(...(params || []));
}
