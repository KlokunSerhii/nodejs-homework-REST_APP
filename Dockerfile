FROM ubuntu 
FROM node:18.15.0

WORKDIR /app

COPY . /app

RUN npm install

EXPOSE 3000

CMD [ "node","server.js" ]
