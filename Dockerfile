FROM node:10.14.1

WORKDIR /home/node/app

COPY package.json .
COPY package-lock.json .
COPY .nvmrc .

RUN npm install -g typescript
RUN npm install

RUN apt-get update && apt-get install -y \
    software-properties-common

RUN add-apt-repository universe
RUN apt-get update && apt-get install -y \
    python3.4 \
    python3-pip \
    pip3 install dlib \
    pip3 install cmake \
    install face-recognition

COPY . .

EXPOSE 8080
ENV NODE_ENV production
CMD tsc && node dist/server.js
