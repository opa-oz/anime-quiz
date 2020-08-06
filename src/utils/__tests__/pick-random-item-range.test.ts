import pickRandomItemRange from '../pick-random-item-range';

test('Should pick 2 items of 2', () => {
    const array = [1, 2];
    const randomArray = pickRandomItemRange(array, 2);

    expect(randomArray).toContain(1);
    expect(randomArray).toContain(2);
});

test('Should pick all items', () => {
    const array = [1, 2];
    const randomArray = pickRandomItemRange(array, 5);

    expect(randomArray).toContain(1);
    expect(randomArray).toContain(2);
})

test('Should pick enough items', () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const randomArray = pickRandomItemRange(array, 5);

    expect(randomArray.length).toEqual(5);
});
