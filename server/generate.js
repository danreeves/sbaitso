const execa = require('execa');

module.exports = async function(text) {
    return execa('./record.sh', [`"${text}"`], {
        shell: '/bin/bash',
        maxBuffer: 100000000,
    });
};
