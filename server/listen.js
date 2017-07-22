const Twit = require('twit');
const generate = require('./generate.js');
const tweet = require('./tweet.js');

require('dotenv').config();

const T = new Twit({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});

const stream = T.stream('user');

stream.on('disconnect', function(disconnect) {
    console.log('> disconnected');
});

stream.on('connect', function(connection) {
    console.log('> connected');
});

stream.on('reconnect', function(reconn, res, interval) {
    console.log('> reconnecting. statusCode:', res.statusCode);
});

stream.on('direct_message', async function({ direct_message }) {
    console.log('> message recieved:', direct_message.text);
    if (direct_message.sender.screen_name === 'dnrvs') {
        await generate(direct_message.text);
        console.log('>> generated');
        await tweet(T, direct_message.text);
        console.log('>> tweeted');
    }
});
