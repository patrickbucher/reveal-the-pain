const redis = require('redis');
const client = redis.createClient();

const {promisify} = require('util');
const getAsync = promisify(client.get).bind(client);

function get(key) {
    return getAsync(key);
}

let a = get('vorname');
let b = get('nachname');
Promise.all([a, b]).then(vals => {
    [vorname, nachname] = vals;
    console.log(vorname, nachname);
});

client.quit();
