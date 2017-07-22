const videoFile = '/tmp/sbaitso/video.mp4';

module.exports = function tweet(T, text) {
    return new Promise(function(resolve, reject) {
        T.postMediaChunked({ file_path: videoFile }, function(
            err,
            data,
            response
        ) {
            if (err) reject(err);

            const mediaIdStr = data.media_id_string;
            const altText = text;
            const meta_params = {
                media_id: mediaIdStr,
                alt_text: { text: altText },
            };

            T.post('media/metadata/create', meta_params, function(
                err,
                data,
                response
            ) {
                if (err) reject(err);
                else {
                    // now we can reference the media and post a tweet (media will attach to the tweet)
                    const params = {
                        status: text,
                        media_ids: [mediaIdStr],
                    };

                    T.post('statuses/update', params, function(
                        err,
                        data,
                        response
                    ) {
                        resolve(data);
                    });
                }
            });
        });
    });
};
