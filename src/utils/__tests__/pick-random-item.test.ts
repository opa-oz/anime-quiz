import pickRandomItem from '../pick-random-item';

test('Should pick random item', () => {
    const array = [1, 2, 3, 4];

    expect(pickRandomItem(array)).not.toBe(null);
});

test('Should return empty item from empty array', () => {
    const array = [];

    expect(pickRandomItem(array)).toBe(undefined);
})
