'use strict';

function categorize(targetTag, dateTags) {
    const categories = new Map();
    const allTags = uniqueTags(dateTags);
    for (const [today, todaysTags] of dateTags) {
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

function uniqueTags(dateTags) {
    const uniqueTags = new Set();
    for (const [date, tags] of dateTags) {
        for (const tag of tags) {
            uniqueTags.add(tag);
        }
    }
    return uniqueTags;
}

module.exports = [categorize, uniqueTags];
