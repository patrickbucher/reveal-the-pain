'use strict';

const categorize = require('./correlation.js');

test('categorize date tags correctly for tag', () => {
    const tag = 'Headache';
    const dateTags = [
        {date: '2019-01-01', tags: ['Beer', 'Headache']},
        {date: '2019-01-02', tags: ['Beer', 'Headache']},
        {date: '2019-01-03', tags: ['Beer']},
        {date: '2019-01-04', tags: ['Beer', 'Headache']},
        {date: '2019-01-05', tags: ['Beer', 'Headache']},
        {date: '2019-01-06', tags: ['Headache']},
        {date: '2019-01-07', tags: ['Wine', 'Sleepiness']},
        {date: '2019-01-08', tags: ['Beer', 'Sleepiness']},
        {date: '2019-01-09', tags: ['Wine', 'Headache']},
        {date: '2019-01-10', tags: ['Water', 'Headache']},
    ];
    const categories = categorize(tag, dateTags);
    
    // category 00=0: neither Headache nor Beer
    expect(categories['Beer'][0]).toBe(1); // once: 2019-01-07

    // category 01=1: no Headache, but Beer
    expect(categories['Beer'][1]).toBe(2); // twice: 2019-01-03/08

    // category 10=2: Headache, but no Beer
    expect(categories['Beer'][2]).toBe(3); // three times: 2019-01-06/09/10

    // category 11=3: Headache and Beer
    expect(categories['Beer'][3]).toBe(4); // four times: 2019-01-01/02/04/05
});
