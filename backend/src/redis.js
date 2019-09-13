const redis = require('redis');
const {promisify} = require('util');

class RedisStorage {
    constructor() {
        this.client = redis.createClient();
        this.get = promisify(this.client.get).bind(this.client);
        this.sadd = promisify(this.client.sadd).bind(this.client);
    }
    createLogentry(username, date, tag) {
        const key = `${username}:${date}`;
        return this.sadd(key, tag);
    }
    quit() {
        client.quit();
    }
}

module.exports = RedisStorage;
