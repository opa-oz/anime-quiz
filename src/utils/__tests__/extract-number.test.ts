import extractNumber from '../extract-number';

const testTable = [
    {
        input: 'My 11 cakes',
        expected: 11,
    },
    {
        input: 'I am 105 years old',
        expected: 105,
    },
    {
        input: 'awuydgwa98fwafawf',
        expected: 98,
    },
    {
        input: 'My answer is 1',
        expected: 1,
    },
    {
        input: 'I have 0 chances',
        expected: 0,
    },
    {
        input: 'This is NaN, I am telling you!',
        expected: null,
    },
];

testTable.forEach(({ input, expected }) => {
    test('Should extract correct number from the string correctly', () => {
        expect(extractNumber(input)).toEqual(expected);
    });
})

