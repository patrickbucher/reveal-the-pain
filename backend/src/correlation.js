'use strict';

function phiCorrelation(causeTag, effectTag, journal) {
    const categories = categorize(effectTag, journal);
    const t = categories.get(causeTag);
    console.log(t);
    return (t[3] * t[0] - t[2] * t[1]) /
        Math.sqrt((t[2] + t[3]) * (t[0] + t[1]) * (t[1] + t[3]) * t[0] + t[2]);
}

function categorize(targetTag, journal) {
    const categories = new Map();
    const allTags = uniqueTags(journal);
    for (const [today, todaysTags] of journal) {
        // present: high index (2 or 3), absent: low index (0 or 1)
        let index = todaysTags.includes(targetTag) ? 2 : 0;
        for (const tag of allTags) {
            if (targetTag == tag) {
                // do not correlate with itself
                continue;
            }
            let categoryCounts = [0, 0, 0, 0];
            if (categories.has(tag)) {
                categoryCounts = categories.get(tag);
            }
            // present: odd index, absent: even index
            index += todaysTags.includes(tag) ? 1 : 0;
            categoryCounts[index] += 1;
            categories.set(tag, categoryCounts);
        }
    }
    return categories;
}

function uniqueTags(journal) {
    const uniqueTags = new Set();
    for (const [date, tags] of journal) {
        for (const tag of tags) {
            uniqueTags.add(tag);
        }
    }
    return uniqueTags;
}

module.exports = [phiCorrelation, categorize, uniqueTags];
