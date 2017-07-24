const execa = require('execa');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = async function(text) {
    try {
        // Remove the out dir
        rimraf.sync('/tmp/sbaitso');

        // Make the out dir
        mkdirp.sync('/tmp/sbaitso');

        // Start the pulseaudio server
        await execa('pulseaudio', [
            '-D',
            '--exit-idle-time=-1',
        ]).catch(() => {});

        // Load the virtual sink and set it as default
        await execa('pacmd', [
            'load-module',
            'module-virtual-sink',
            'sink_name=v1',
        ]);
        await execa('pacmd', ['set-default-sink', 'v1']);

        // Set the monitor of v1 sink to be the default source
        await execa('pacmd', ['set-default-source', 'v1.monitor']);

        // Start the ffmpeg capture to an audio file
        const recording = execa('ffmpeg', [
            '-y',
            '-f',
            'pulse',
            '-i',
            'default',
            '-c:a',
            'libmp3lame',
            '/tmp/sbaitso/out.mp3',
        ]).catch(() => {});

        // Wait for ffmpeg recording to catch up
        await sleep(1000);

        // Start dosox & dr sbaitso
        await execa(
            'dosbox',
            ['-c', 'mount C sbaitso', '-c', 'C:', '-c', `SAY.BAT "${text}"`],
            {
                env: {
                    TERM: 'xterm',
                },
            }
        );

        await sleep(1000);

        recording.kill();

        // Trim the silence at start
        await execa('ffmpeg', [
            '-y',
            '-i',
            '/tmp/sbaitso/out.mp3',
            '-c:a',
            'libmp3lame',
            '-af',
            'silenceremove=1:0:-50dB',
            '/tmp/sbaitso/trimmed1.mp3',
        ]);

        // Reverse the audio
        await execa('ffmpeg', [
            '-y',
            '-i',
            '/tmp/sbaitso/trimmed1.mp3',
            '-c:a',
            'libmp3lame',
            '-af',
            'areverse',
            '/tmp/sbaitso/reversed.mp3',
        ]);

        // Trim the silence at end
        await execa('ffmpeg', [
            '-y',
            '-i',
            '/tmp/sbaitso/reversed.mp3',
            '-c:a',
            'libmp3lame',
            '-af',
            'silenceremove=1:0:-50dB',
            '/tmp/sbaitso/trimmed2.mp3',
        ]);

        // Reverse the audio again
        await execa('ffmpeg', [
            '-y',
            '-i',
            '/tmp/sbaitso/trimmed2.mp3',
            '-c:a',
            'libmp3lame',
            '-af',
            'areverse',
            '/tmp/sbaitso/alltrimmed.mp3',
        ]);

        // Turn it into a video
        return execa('ffmpeg', [
            '-y',
            '-loop',
            '1',
            '-i',
            'sbaitso.png',
            '-i',
            '/tmp/sbaitso/alltrimmed.mp3',
            '-c:a',
            'aac',
            '-strict',
            '-2',
            '-b:a',
            '64k',
            '-c:v',
            'libx264',
            '-b:v',
            '768K',
            '-shortest',
            '-pix_fmt',
            'yuv420p',
            '/tmp/sbaitso/video.mp4',
        ]);
    } catch (err) {
        // console.log(err);
    }
};
