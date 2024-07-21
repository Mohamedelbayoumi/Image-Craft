const { createClient } = require('redis');

let redisClient;

if (process.env.NODE_ENV != 'production') {
    (async () => {
        redisClient = await createClient().connect()
    })()
}

module.exports = redisClient