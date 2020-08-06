import shortDescription from '../short-description';

test('Should make the string 256 symbols long', () => {
    const string = new Array(500).fill('1').join();

    expect(shortDescription(string).length).toEqual(256);
    expect(shortDescription(string).endsWith('...')).toBeTruthy();
});

test('Should save the length of the string', () => {
    const string = 'test string';

    expect(shortDescription(string).length).toEqual(string.length);
});

test('Should cut extra symbols', () => {
    const string = 'test string';

    expect(shortDescription(string, 7)).toEqual('test...');
});
