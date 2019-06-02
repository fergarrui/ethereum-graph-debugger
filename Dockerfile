FROM node:8-alpine

RUN apk update && apk upgrade && \
    apk add --no-cache bash git python g++ gcc libgcc libstdc++ linux-headers make

RUN npm install --quiet node-gyp -g

WORKDIR /opt/app

COPY package.json ./

RUN npm i -g npm@^6.1.0 && npm install

COPY . .

EXPOSE 9090

CMD [ "npm", "run", "start" ]
