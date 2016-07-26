FROM alpine:3.4

RUN apk update && apk upgrade \
 && apk --update add --no-cache nodejs

RUN apk --update add --no-cache git

RUN rm -rf /var/cache/apk/*

ENV NODE_ENV production

WORKDIR /src
ADD . .

# RUN npm install -g --production node-gyp@latest
RUN npm install -g --production

CMD ["node", "local.js"]
