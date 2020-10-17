FROM node:12.19.0-alpine3.12

WORKDIR /app

COPY package.json /app
COPY package-lock.json /app

RUN npm install --silent

COPY . /app

CMD ["npm", "start"]
