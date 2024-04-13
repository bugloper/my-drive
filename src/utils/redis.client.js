
const redis = require('redis');
const REDIS_PORT = 6379; // Redis port number
const client = redis.createClient({ port: REDIS_PORT });

client.on('connect', () => {
    console.log('Connected to Redis');
});
(async () => {
    await client.connect();
})();
module.exports = client;
