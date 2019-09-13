const redis = require('redis');
const {promisify} = require('util');

class RedisStorage {
    constructor(address) {
        this.client = redis.createClient(address);
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
