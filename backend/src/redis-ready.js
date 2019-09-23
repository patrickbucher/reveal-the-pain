'use strict';

const redis = require('redis');
const address = 'redis://' + (process.env.REDIS || 'localhost:6379');
const client = redis.createClient(address);
client.on('error', () => {
    console.log(`unable to connect to ${address}`);
});
client.on('ready', () => {
    console.log(`connectd to ${address}`);
    client.quit();
});
