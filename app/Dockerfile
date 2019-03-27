FROM node:10.15-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install --production

COPY index.js .

CMD npm start
