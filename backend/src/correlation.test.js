'use strict';

const [categorize, uniqueTags] = require('./correlation.js');

function createTestData() {
    const dateTags = new Map();

    dateTags.set('2019-01-01', ['Beer', 'Headache']);
    dateTags.set('2019-01-02', ['Beer', 'Headache']);
    dateTags.set('2019-01-03', ['Beer']);
    dateTags.set('2019-01-04', ['Beer', 'Headache']);
    dateTags.set('2019-01-05', ['Beer', 'Headache']);
    dateTags.set('2019-01-06', ['Headache']);
    dateTags.set('2019-01-07', ['Wine', 'Sleepiness']);
    dateTags.set('2019-01-08', ['Beer', 'Sleepiness']);
    dateTags.set('2019-01-09', ['Wine', 'Headache']);
    dateTags.set('2019-01-10', ['Water', 'Headache']);

    return dateTags;
}

test('flatten dateTags map to unique list of tags', () => {
    // Arrange
    const dateTags = createTestData();
    const allTags = new Set(['Beer', 'Headache', 'Wine', 'Sleepiness', 'Water']);

    // Act
    const got = uniqueTags(dateTags);
    
    // Assert
    expect(got.has('Beer')).toBe(true);
    expect(got.has('Headache')).toBe(true);
    expect(got.has('Wine')).toBe(true);
    expect(got.has('Sleepiness')).toBe(true);
    expect(got.has('Water')).toBe(true);
    expect(got.size).toBe(allTags.size);
});

test('categorize date tags correctly for tag', () => {
    // Arrange
    const targetTag = 'Headache';
    const dateTags = createTestData();

    // Act
    const categories = categorize(targetTag, dateTags);
    
    // Assert
    // category 00=0: neither Headache nor Beer
    expect(categories.get('Beer')[0]).toBe(1); // once: 2019-01-07

    // category 01=1: no Headache, but Beer
    expect(categories.get('Beer')[1]).toBe(2); // twice: 2019-01-03/08

    // category 10=2: Headache, but no Beer
    expect(categories.get('Beer')[2]).toBe(3); // three times: 2019-01-06/09/10

    // category 11=3: Headache and Beer
    expect(categories.get('Beer')[3]).toBe(4); // four times: 2019-01-01/02/04/05
});
