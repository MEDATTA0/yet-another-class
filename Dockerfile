FROM node:24-alpine

RUN apk update

WORKDIR /app

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "start" ]