'use strict';

const express = require('express');
const RedisStorage = require('./redis');
const [validDate, validUsername, validTag] = require('./validator');
const [correlate] = require('./correlation');

const PORT = process.env.PORT || '8000';
const HOST = '0.0.0.0';
const REDIS = 'redis://' + (process.env.REDIS || 'localhost:6379');

const app = express();
const storage = new RedisStorage(REDIS);

app.get('/canary', (req, res) => {
    res.sendStatus(200);
});

app.put('/:username/logentry/:date/:tag', (req, res) => {
    try {
        const {username, date, tag} = extractLogentryParams(req);
        storage.createLogentry(username, date, tag)
            .then(() => res.sendStatus(201))
            .catch(() => res.sendStatus(500));
    } catch(err) {
        console.log(err.message);
        res.sendStatus(400);
    }
});

app.delete('/:username/logentry/:date/:tag', (req, res) => {
    try {
        const {username, date, tag} = extractLogentryParams(req);
        storage.deleteLogentry(username, date, tag)
            .then(() => res.sendStatus(200))
            .catch(() => res.sendStatus(500));
    } catch(err) {
        console.log(err.message);
        res.sendStatus(400);
    }
});

app.get('/:username/tags', (req, res) => {
    const username = req.params.username;
    if (!validUsername(username)) {
        console.log(`invalid username ${username}`);
        res.sendStatus(400);
        return;
    }
    storage.getUserTags(username)
        .then(tags => res.json(tags))
        .catch(() => res.sendStatus(500));
});

app.get('/:username/:date/tags', (req, res) => {
    const username = req.params.username;
    if (!validUsername(username)) {
        console.log(`invalid username ${username}`);
        res.sendStatus(400);
        return
    }
    const date = req.params.date;
    if (!validDate(date)) {
        console.log(`invalid date ${date}`);
        res.sendStatus(400);
        return
    }
    storage.getUserDateTags(username, date)
        .then(tags => res.json(tags))
        .catch(() => res.sendStatus(500));
});

app.get('/:username/correlation/:tag', (req, res) => {
    const username = req.params.username;
    if (!validUsername(username)) {
        console.log(`invalid username ${username}`);
        res.sendStatus(400);
        return
    }
    const tag = req.params.tag;
    storage.getUserTags(username).then(tags => {
        if (!tags.includes(tag)) {
            throw new Error(`${username} has no tag ${tag}`);
        }
    }).then(() => {
        return storage.getUserDates(username);
    }).then(dates => {
        return Promise.all(dates.map(date => {
            const tagsProm = storage.getUserDateTags(username, date);
            return tagsProm.then(tags => { return {date, tags}; });
        }));
    }).then(dateTags => {
        const journal = new Map();
        dateTags.forEach(({date, tags}) => journal.set(date, tags));
        const correlations = correlate(tag, journal);
        const table = new Array();
        for (const [tag, correlation] of correlations.entries()) {
            if (isNaN(correlation)) {
                continue;
            }
            table.push({tag, correlation});
        }
        return res.json(table);
    }).catch(err => {
        console.log(err)
        res.sendStatus(400);
    });

});

const extractLogentryParams = req => {
    const username = req.params.username;
    const date = req.params.date;
    const tag = req.params.tag;
    const invalidFields = new Array();
    if (!validUsername(username)) {
        invalidFields.push('username');
    }
    if (!validUsername(date)) {
        invalidFields.push('date');
    }
    if (!validUsername(tag)) {
        invalidFields.push('tag');
    }
    if (invalidFields.size > 0) {
        const fields = invalidFields.join(', ');
        throw new Error(`invalid input data: ${fields}`);
    }
    return {username, date, tag};
}

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
