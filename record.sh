# Start the pulseaudio server
pulseaudio -D --exit-idle-time=-1

# Load the virtual sink and set it as default
pacmd load-module module-virtual-sink sink_name=v1
pacmd set-default-sink v1

# set the monitor of v1 sink to be the default source
pacmd set-default-source v1.monitor

# Start the ffmpeg capture to an audio file
ffmpeg -y -f pulse -i default out/out.mp3 & FFPID=$!

# Wait for ffmpeg recording to catch up
sleep 1

# Start dosox & dr sbaitso
dosbox -c 'mount C sbaitso' -c 'C:' -c 'SAY.BAT "Hello, This Is Doctor Sbaitso"'

# kill the ffmpeg recording
kill $FFPID

# trim the silence at start
ffmpeg -y -i out/out.mp3 -af silenceremove=1:0:-50dB out/trimmed1.mp3

# reverse the audio
ffmpeg -y -i out/trimmed1.mp3 -af areverse out/reversed.mp3

# trim the silence at end
ffmpeg -y -i out/reversed.mp3 -af silenceremove=1:0:-50dB out/trimmed2.mp3

# reverse the audio again
ffmpeg -y -i out/trimmed2.mp3 -af areverse out/alltrimmed.mp3


# make a video
ffmpeg \
    -y \
    -loop 1 \
    -i sbaitso.png \
    -i out/alltrimmed.mp3 \
    -c:a aac \
    -strict -2 \
    -b:a 64k \
    -c:v libx264 \
    -b:v 768K \
    -shortest \
    -pix_fmt yuv420p \
    out/video.mp4

# TODO: https://dev.twitter.com/rest/media/uploading-media#videorecs
