export default function extractNumber(source?: string): number | null {
    if (!source) {
        return null;
    }

    const cleanedSource = source.replace(/[^0-9]/g, '');
    const parsedNumber = parseInt(cleanedSource, 10);

    if (Number.isNaN(parsedNumber)) {
        return null;
    }

    return parsedNumber;
}
