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
    const username = req.params.username;
    const date = req.params.date;
    const tag = req.params.tag;
    if (!validUsername(username) || !validDate(date) || !validTag(tag)) {
        res.sendStatus(400);
    }
    storage.createLogentry(username, date, tag)
        .then(() => res.sendStatus(201))
        .catch(() => res.sendStatus(500));
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
