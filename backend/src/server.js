'use strict';

const express = require('express');
const RedisStorage = require('./redis');
const [validDate, validUsername, validTag] = require('./validator');

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

const extractLogentryParams = req => {
    const username = req.params.username;
    const date = req.params.date;
    const tag = req.params.tag;
    // TODO: more specific error message (what input was invalid?)
    if (!validUsername(username) || !validDate(date) || !validTag(tag)) {
        throw new Error("invalid input data");
    }
    return {username, date, tag};
}

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
