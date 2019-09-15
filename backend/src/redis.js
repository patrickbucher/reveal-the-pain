'use strict';

const redis = require('redis');
const {promisify} = require('util');

class RedisStorage {
    constructor(address) {
        this.client = redis.createClient(address);
        // TODO: do this in a for loop
        this.get = promisify(this.client.get).bind(this.client);
        this.sadd = promisify(this.client.sadd).bind(this.client);
        this.srem = promisify(this.client.srem).bind(this.client);
        this.keys = promisify(this.client.keys).bind(this.client);
        this.smembers = promisify(this.client.smembers).bind(this.client);
    }
    createLogentry(username, date, tag) {
        const key = `${username}:${date}`;
        return this.sadd(key, tag);
    }
    deleteLogentry(username, date, tag) {
        const key = `${username}:${date}`;
        return this.srem(key, tag);
    }
    getUserTags(username) {
        const pattern = `${username}*`;
        return this.keys(pattern).then(result => {
            return Promise.all(result.map(key => this.smembers(key)));
        }).then(result => {
            const tags = new Set();
            for (const tagSet of result) {
                for (const tag of tagSet) {
                    tags.add(tag);
                }
            }
            return Array.from(tags);
        });
    }
    getUserDateTags(username, date) {
        const key = `${username}:${date}`;
        return this.smembers(key);
    }
    getUserDates(username) {
        const pattern = `${username}*`;
        return this.keys(pattern).then(result => {
            return Promise.all(result.map(key => key.split(':')[1]));
        });
    }
    quit() {
        client.quit();
    }
}

module.exports = RedisStorage;
