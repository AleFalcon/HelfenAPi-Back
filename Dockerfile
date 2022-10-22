FROM ubuntu:20.04

RUN apt-get update -y && apt update -y && apt-get install -y curl && apt install python3.8 python3-dev python3-pip -y && alias python=python3.8
# bash will load volta() function via .bashrc 
# using $VOLTA_HOME/load.sh
SHELL ["/bin/bash", "-c"]
# since we're starting non-interactive shell, 
# we wil need to tell bash to load .bashrc manually
ENV BASH_ENV ~/.bashrc
# needed by volta() function
ENV VOLTA_HOME /root/.volta
# make sure packages managed by volta will be in PATH
ENV PATH $VOLTA_HOME/bin:$PATH
RUN curl https://get.volta.sh | bash

COPY . /usr/helfen_app/
WORKDIR /usr/helfen_app

RUN volta install node && volta install npm && npm i --save-dev @types/bcrypt
RUN python3.8 -m pip install --upgrade pip
# RUN python3.8 -m pip install "cmake" && python3.8 -m pip install -r requirements.txt
RUN chmod 777 /usr/helfen_app/*
CMD ./start.sh
