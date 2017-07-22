#!/usr/bin/env bash

# # Remove the out dir
rm -rf /tmp/sbaitso

# # Make the out dir
mkdir -p /tmp/sbaitso

# Start the pulseaudio server
pulseaudio -D --exit-idle-time=-1

# Load the virtual sink and set it as default
pacmd load-module module-virtual-sink sink_name=v1
pacmd set-default-sink v1

# Set the monitor of v1 sink to be the default source
pacmd set-default-source v1.monitor

# Start the ffmpeg capture to an audio file
ffmpeg -y -f pulse -i default -c:a libmp3lame /tmp/sbaitso/out.mp3 & FFPID=$!

# Wait for ffmpeg recording to catch up
sleep 1

# Start dosox & dr sbaitso
dosbox -c 'mount C sbaitso' -c 'C:' -c "SAY.BAT \"$1\""

sleep 1

# Kill the ffmpeg recording
kill -INT $FFPID

# Trim the silence at start
ffmpeg -y -i /tmp/sbaitso/out.mp3 -c:a libmp3lame -af silenceremove=1:0:-50dB /tmp/sbaitso/trimmed1.mp3

# Reverse the audio
ffmpeg -y -i /tmp/sbaitso/trimmed1.mp3 -c:a libmp3lame -af areverse /tmp/sbaitso/reversed.mp3

# Trim the silence at end
ffmpeg -y -i /tmp/sbaitso/reversed.mp3 -c:a libmp3lame -af silenceremove=1:0:-50dB /tmp/sbaitso/trimmed2.mp3

# Reverse the audio again
ffmpeg -y -i /tmp/sbaitso/trimmed2.mp3 -c:a libmp3lame -af areverse /tmp/sbaitso/alltrimmed.mp3

# Turn it into a video
ffmpeg \
    -y \
    -loop 1 \
    -i sbaitso.png \
    -i /tmp/sbaitso/alltrimmed.mp3 \
    -c:a aac \
    -strict -2 \
    -b:a 64k \
    -c:v libx264 \
    -b:v 768K \
    -shortest \
    -pix_fmt yuv420p \
    /tmp/sbaitso/video.mp4
