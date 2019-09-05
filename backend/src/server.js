'use strict';

const express = require('express');

const PORT = 8000; // TODO: get from env var
const HOST = '0.0.0.0';

const app = express();
app.get('/hello', (req, res) => {
    res.send('Hello, world!\n');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
