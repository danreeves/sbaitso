FROM ubuntu
RUN apt-get -y update
RUN apt-get -y install wget curl
RUN curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
RUN apt-get -y install -y nodejs
RUN apt-get -y install dosbox alsa-utils pulseaudio socat
RUN apt-get -y install -y autoconf automake build-essential mercurial git libarchive-dev fontconfig checkinstall
RUN apt-get -y install -y libass-dev libfreetype6-dev libsdl1.2-dev libtheora-dev libgnutls-dev
RUN apt-get -y install -y libxcb1-dev libxcb-shm0-dev libxcb-xfixes0-dev pkg-config texinfo libtool libva-dev
RUN apt-get -y install -y libbs2b-dev libcaca-dev libopenjpeg-dev librtmp-dev libvpx-dev libvdpau-dev
RUN apt-get -y install -y libwavpack-dev libxvidcore-dev lzma-dev liblzma-dev zlib1g-dev cmake-curses-gui
RUN apt-get -y install -y libx11-dev libxfixes-dev libmp3lame-dev libx264-dev #libx264-146 libx264-dev
RUN apt-get -y install -y libfdk-aac-dev ffmpeg
WORKDIR /usr/src/app
ENTRYPOINT ['nodejs', 'server/listen.js']
