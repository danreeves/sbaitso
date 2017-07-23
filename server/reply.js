const strings = require('../strings.json');

function random(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

module.exports = function getReply(tweetString, name) {
    tweetString = tweetString.replace('@sbaitsobot', '');

    const matches = strings
        .map(map => {
            const inputs = typeof map.input === 'string'
                ? [map.input]
                : map.input;

            for (let input of inputs) {
                // console.log(input);
                const matcher = new RegExp(input.replace('*', '(.*)'), 'igm');
                if (tweetString.match(matcher)) {
                    return {
                        match: matcher.exec(tweetString),
                        map: map,
                    };
                }
            }
        })
        .filter(Boolean);

    if (!matches.length) {
        return random(strings.filter(map => map.input === 'unknown')[0].output);
    }

    const match = matches[0];
    let reply = '';

    // Do we have a capture group?
    if (match.match.length > 1) {
        const specific = match.match[1].trim().replace('?', '');
        const response = random(match.map.output);
        reply = response.replace('*', specific);
    } else {
        reply = random(match.map.output).replace('*', '');
    }

    return reply.toUpperCase().replace('~', name);
}
