const [validDate, validUsername, validTag] = require('./validator');

test('"foobar" is not a valid date', () => {
    expect(validDate('foobar')).toBe(false);
});
