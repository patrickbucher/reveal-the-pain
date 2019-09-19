'use strict';

const [correlate, phiCorrelation, categorize, uniqueTags] = require('./correlation.js');

function createJournal() {
    const journal = new Map();

    journal.set('2019-01-01', ['Beer', 'Headache']);
    journal.set('2019-01-02', ['Beer', 'Headache']);
    journal.set('2019-01-03', ['Beer']);
    journal.set('2019-01-04', ['Beer', 'Headache']);
    journal.set('2019-01-05', ['Beer', 'Headache']);
    journal.set('2019-01-06', ['Headache']);
    journal.set('2019-01-07', ['Wine', 'Sleepiness']);
    journal.set('2019-01-08', ['Beer', 'Sleepiness']);
    journal.set('2019-01-09', ['Wine', 'Headache']);
    journal.set('2019-01-10', ['Water', 'Headache']);

    return journal;
}

test('calculate all the correlations for the journal', () => {
    // Arrange
    const effectTag = 'Headache';
    const otherTags = ['Beer', 'Wine', 'Sleepiness', 'Water'];
    const journal = createJournal();

    // Act
    const correlations = correlate(effectTag, journal);

    // Assert
    expect(correlations.size).toBe(otherTags.length);
    for (const tag of otherTags) {
        expect(correlations.has(tag)).toBe(true);
        expect(correlations.get(tag)).toBeGreaterThanOrEqual(-1);
        expect(correlations.get(tag)).toBeLessThanOrEqual(1);
    }
});

test('calculate a single phi correlation', () => {
    // Arrange
    const effectTag = 'Headache';
    const journal = createJournal();

    for (let t of uniqueTags(journal)) {
        // Act
        if (t == effectTag) {
            continue;
        }
        const corr = phiCorrelation(t, effectTag, journal);

        // Assert
        expect(corr).toBeGreaterThanOrEqual(-1);
        expect(corr).toBeLessThanOrEqual(1);
    }
});

test('categorize date tags correctly for tag', () => {
    // Arrange
    const targetTag = 'Headache';
    const journal = createJournal();

    // Act
    const categories = categorize(targetTag, journal);
    
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

test('flatten journal map to unique list of tags', () => {
    // Arrange
    const journal = createJournal();
    const allTags = new Set(['Beer', 'Headache', 'Wine', 'Sleepiness', 'Water']);

    // Act
    const got = uniqueTags(journal);
    
    // Assert
    expect(got.has('Beer')).toBe(true);
    expect(got.has('Headache')).toBe(true);
    expect(got.has('Wine')).toBe(true);
    expect(got.has('Sleepiness')).toBe(true);
    expect(got.has('Water')).toBe(true);
    expect(got.size).toBe(allTags.size);
});
