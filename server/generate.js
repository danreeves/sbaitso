const execa = require('execa');

module.exports = async function(text) {
    return execa('./record.sh', [`"${text}"`]);
};
