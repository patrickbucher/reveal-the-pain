'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');

const RedisStorage = require('./redis');
const [validDate, validUsername, validTag] = require('./validator');
const [correlate] = require('./correlation');
const [credentials, secretKey] = require('./credentials');

const PORT = process.env.PORT || '8000';
const HOST = '0.0.0.0';
const REDIS = 'redis://' + (process.env.REDIS || 'localhost:6379');

const app = express();
app.use(bodyParser.json());
const storage = new RedisStorage(REDIS);

const hashedCredentials = new Map();
for (const [username, password] of credentials.entries()) {
    const hash = bcrypt.hashSync(password, 10);
    hashedCredentials.set(username, hash);
}

// NOTE: the canary endpoint is public, no authentication required
app.get('/canary', (req, res) => {
    res.sendStatus(200);
});

app.post('/token', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const result = bcrypt.compareSync(password, hashedCredentials.get(username));
    if (result) {
        const expiry = 5 * 60;
        const token = jwt.sign({sub: username}, secretKey, {expiresIn: expiry});
        res.send({'access_token': token});
    } else {
        res.sendStatus(401);
    }
});

app.put('/:username/logentry/:date/:tag', (req, res) => {
    if (!authenticated(req)) {
        res.sendStatus(401);
        return;
    }
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
    if (!authenticated(req)) {
        res.sendStatus(401);
        return;
    }
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
    if (!authenticated(req)) {
        res.sendStatus(401);
        return;
    }
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
    if (!authenticated(req)) {
        res.sendStatus(401);
        return;
    }
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
    if (!authenticated(req)) {
        res.sendStatus(401);
        return;
    }
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

const authenticated = (req) => {
    const username = req.params.username;
    if (!validUsername(username)) {
        return false;
    }
    // Authentication: Bearer xxxxxxxxxxxxxxxxxxxxxxxxx
    const auth = req.headers.authorization;
    if (auth == undefined) {
        return false;
    }
    // Bearer xxxxxxxxxxxxxxxxxxxxxxxxx
    const token = auth.substr(auth.indexOf(' ')).trim();
    if (token == '') {
        return false;
    }
    try {
        const result = jwt.verify(token, secretKey);
        if (result) {
            return result.sub === username;
        }
        return false;
    } catch (error) {
        console.log(error);
        return false;
    }
}

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
