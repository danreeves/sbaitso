const Twit = require('twit');
const makeQueue = require('queue');
const generate = require('./generate.js');
const tweet = require('./tweet.js');

require('dotenv').config();

const T = new Twit({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});

const tweetQueue = makeQueue({
    concurrency: 1,
    autostart: 1,
});

const stream = T.stream('user');

const whitelistNames = [
    'dnrvs',
    'sbaitsobot',
    'nickbreckon',
    'chrisremo',
    'ja2ke',
    'importantcast',
];

async function generateAndTweet(T, direct_message) {
    console.log('>> processing:', direct_message.text);
    try {
        await generate(direct_message.text);
        console.log('>>> generated');
        await tweet(T, direct_message.text);
        console.log('>>> tweeted');
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

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
    if (whitelistNames.includes(direct_message.sender.screen_name)) {
        tweetQueue.push(function(cb) {
            generateAndTweet(T, direct_message).then(res => {
                cb();
            });
        });
    }
});
