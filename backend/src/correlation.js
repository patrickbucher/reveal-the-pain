'use strict';

function correlate(effectTag, journal) {
    const correlations = new Map();
    const categories = categorize(effectTag, journal);
    const tags = uniqueTags(journal);
    for (const tag of tags) {
        if (tag === effectTag) {
            continue;
        }
        const corr = phiCorrelation(tag, effectTag, journal);
        correlations.set(tag, corr);
    }
    return correlations;
}

function phiCorrelation(causeTag, effectTag, journal) {
    const categories = categorize(effectTag, journal);
    const t = categories.get(causeTag);
    return (t[3] * t[0] - t[2] * t[1]) /
        Math.sqrt((t[2] + t[3]) * (t[0] + t[1]) * (t[1] + t[3]) * (t[0] + t[2]));
}

// Quadrants:
// | 00=0 | 01=1 |
// | 10=2 | 11=3 |
function categorize(targetTag, journal) {
    const categories = new Map();
    const allTags = uniqueTags(journal);
    for (const [today, todaysTags] of journal) {
        // present: high index (2 or 3), absent: low index (0 or 1)
        for (const tag of allTags) {
            let index = todaysTags.includes(targetTag) ? 2 : 0;
            if (targetTag == tag) {
                // do not correlate with itself
                continue;
            }
            let categoryCounts = [0, 0, 0, 0];
            if (categories.has(tag)) {
                categoryCounts = categories.get(tag);
            }
            // present: odd index, absent: even index
            if (todaysTags.includes(tag)) {
                index++;
            }
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

module.exports = [correlate, phiCorrelation, categorize, uniqueTags];
