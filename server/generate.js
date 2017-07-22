const execa = require('execa');

module.exports = async function(text) {
    return execa('./record.sh', [`"${text}"`], {
        detached: true,
        stdio: 'ignore',
        shell: '/bin/bash',
    });
};
