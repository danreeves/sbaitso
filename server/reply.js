const strings = require('../strings.json');

function getReply(input) {
    const matches = strings.map(map => {
        const matcher = new RegExp(map.input.replace('*', '(.*)'), 'igm');
        if (input.match(matcher)) {
            return {
                match: matcher.exec(input),
                map: map,
            };
        }
    }).filter(Boolean);
    console.log(matches[0])
}

getReply('Are you a robot?');
