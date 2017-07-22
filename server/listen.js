const Twit = require('twit');
const RunQueue = require('run-queue');
const generate = require('./generate.js');
const tweet = require('./tweet.js');

require('dotenv').config();

const T = new Twit({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});

const tweetQueue = RunQueue({
    maxConcurrency: 1,
});

const stream = T.stream('user');

async function generateAndTweet(T, direct_message) {
    await generate(direct_message.text);
    console.log('>> generated');
    await tweet(T, direct_message.text);
    console.log('>> tweeted');
    return true;
}

function runQueue() {
    tweetQueue.run().then(() => {
        setTimeout(runQueue, 1000);
    });
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
    if (direct_message.sender.screen_name === 'dnrvs') {
        tweetQueue.add(1, generateAndTweet, [T, direct_message]);
    }
});

runQueue();
