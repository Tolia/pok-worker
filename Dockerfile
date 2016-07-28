FROM alpine:3.4

RUN apk update && apk upgrade \
 && apk --update add --no-cache nodejs git

RUN rm -rf /var/cache/apk/*

WORKDIR /src
ADD . .

ENV NODE_ENV production

RUN npm install

run apk del git

CMD ["node", "lib/main.js"]
