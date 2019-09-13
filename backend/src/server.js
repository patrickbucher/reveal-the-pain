'use strict';

const express = require('express');
const RedisStorage = require('./redis');

const PORT = process.env.PORT || '8000';
const HOST = '0.0.0.0';

const app = express();
const storage = new RedisStorage(); // TODO: consider passing hostname:port

app.get('/canary', (req, res) => {
    res.sendStatus(200);
});

app.put('/:username/logentry/:date/:tag', (req, res) => {
    // TODO validate input data
    const username = req.params.username;
    const date = req.params.date;
    const tag = req.params.tag;
    storage.createLogentry(username, date, tag)
        .then(x => console.log)
        .catch(e => console.err);
    res.sendStatus(201);
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
