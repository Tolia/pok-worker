FROM alpine:3.4

RUN apk update && apk upgrade \
 && apk --update add --no-cache nodejs git

RUN rm -rf /var/cache/apk/*

ENV NODE_ENV production

WORKDIR /src
ADD . .
EXPOSE 5671 5672

RUN npm install -g --production

run apk del git

CMD ["node", "amqp.js"]
