const [validDate, validUsername, validTag] = require('./validator');

test('the date format must be YYYY-MM-DD', () => {
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

test('the username must be an alphanumeric string of length 4..12', () => {
    expect(validUsername('paedu')).toBe(true);
    expect(validUsername('jay')).toBe(false); // too short
    expect(validUsername('monsieurlemister')).toBe(false); // too long
    expect(validUsername('hans-landa')).toBe(false); // dash not allowed
    expect(validUsername(' john ')).toBe(false); // trailing spaces
    expect(validUsername('wHaTeVeR')).toBe(true);
    expect(validUsername('john1337')).toBe(true);
});
