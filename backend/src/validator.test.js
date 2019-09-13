const [validDate, validUsername, validTag] = require('./validator');

test('the date format must be YYYY-MM-DD', () => {
    const tests = new Map();
    expect(validDate('2019-09-13')).toBe(true);
    expect(validDate('2019-01-01')).toBe(true);
    expect(validDate('2019-12-31')).toBe(true);
    expect(validDate('2019-31-12')).toBe(false);
    expect(validDate('19-01-01')).toBe(false);
    expect(validDate('1900-06-24')).toBe(true);
    expect(validDate('1999-02-28')).toBe(true);
    expect(validDate('1999-2-28')).toBe(false);
    expect(validDate('2019-09-13')).toBe(true);
});
