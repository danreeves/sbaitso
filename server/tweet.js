const path = require('path');
const Twit = require('twit');

require('dotenv').config();

const T = new Twit({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});

const videoFile = path.join(__dirname, '../out/video.mp4');

T.postMediaChunked({ file_path: videoFile }, function(err, data, response) {
    const mediaIdStr = data.media_id_string;
    const altText = 'Hello, my name is Dr. Sbaitso';
    const meta_params = { media_id: mediaIdStr, alt_text: { text: altText } };

    T.post('media/metadata/create', meta_params, function(err, data, response) {
        if (!err) {
            // now we can reference the media and post a tweet (media will attach to the tweet)
            const params = {
                status: 'Hello, my name is Dr. Sbaitso',
                media_ids: [mediaIdStr],
            };

            T.post('statuses/update', params, function(err, data, response) {
                console.log(data);
            });
        }
    });
});
