FROM ubuntu
RUN apt-get update -y
RUN apt-get install dosbox alsa-utils pulseaudio socat ffmpeg -y
