# Start the pulseaudio server
pulseaudio -D --exit-idle-time=-1

# Load the virtual sink and set it as default
pacmd load-module module-virtual-sink sink_name=v1
pacmd set-default-sink v1

# set the monitor of v1 sink to be the default source
pacmd set-default-source v1.monitor

# Start the ffmpeg capture to an audio file
ffmpeg -y -f pulse -i default out.mp3 & FFPID=$!

# Wait for ffmpeg recording to catch up
sleep 1

# Start dosox & dr sbaitso
dosbox -c 'mount C sbaitso' -c 'C:' -c 'SAY.BAT "Hello, This Is Doctor Sbaitso"'

# kill the ffmpeg recording
kill $FFPID

# trim the silence
ffmpeg -y -i out.mp3 -af silenceremove=1:0:-50dB trimmed.mp3

# make a video
ffmpeg -loop 1 -i sbaitso.png -i trimmed.mp3 -c:a copy -c:v libx264 -shortest out.mp4

# TODO: https://dev.twitter.com/rest/media/uploading-media#videorecs
