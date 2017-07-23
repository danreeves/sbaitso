const strings = require('../strings.json');

function random(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getReply(tweetString, name) {
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

    // Do we have a capture group?
    if (match.match.length > 1) {
        const specific = match.match[1].trim().replace('?', '');
        const response = random(match.map.output);
        return response.replace('*', specific).toUpperCase().replace('~', name);
    } else {
        return random(match.map.output)
            .replace('*', '')
            .toUpperCase()
            .replace('~', name);
    }
}
