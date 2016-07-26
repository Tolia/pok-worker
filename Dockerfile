FROM alpine:3.4

RUN apk update && apk upgrade \
 && apk --update add --no-cache nodejs git

RUN rm -rf /var/cache/apk/*

ENV NODE_ENV production

WORKDIR /src
ADD . .

RUN npm install

run apk del git

CMD ["node", "amqp.js"]
