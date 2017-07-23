const execa = require('execa');

const stream = execa('dosbox', [
    '-c',
    'mount C sbaitso',
    '-c',
    'C:',
    '-c',
    'SAY.BAT "HELLO"',
]).stdout;

stream.pipe(process.stdout);
