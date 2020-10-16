FROM node:12.19.0-alpine3.12

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --no-cache

COPY . .

CMD [ "npm", "run", "start:dev" ]