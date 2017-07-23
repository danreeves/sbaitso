const execa = require('execa');

execa('dosbox', ['-c', 'mount C sbaitso', '-c', 'C:', '-c', 'SAY.BAT "HELLO"']);
