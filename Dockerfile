
FROM node:21-alpine

COPY . /app

RUN yarn install && yarn build



