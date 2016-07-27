"use strict";

const APP = require('./index')
const config = require('./config/amqp')
const user = require('./config/user')
const amqlibCb = require('amqplib/callback_api')

console.log(config)

const bail = (err) => {
  console.error(err)
  process.exit(1)
}

const publisher = (conn, payload) => {
  conn.createChannel((err, ch) => {
    if (err != null) bail(err)
    ch.assertQueue(config.routing.pub)
    ch.sendToQueue(config.routing.pub,
      new Buffer(JSON.stringify(payload)),
      {contentType: 'application/json'})
  })
}

const subscriber = (conn, msg, cb) => {
  const { uid, coords } = JSON.parse(msg.content.toString())
  const point = {
    latitude: coords.latitude,
    longitude: coords.longitude
  }

  const event = {
    debug: true,
    pgoUsername: user.username,
    pgoPassword: user.password, // || '2041651734561566042'), //'adjh321kdsaasd'
    pgoProvider: user.provider, // || 'google'),
    pgoLocation: { type: 'coords', coords: point }
  }

  console.log('send', event)

  APP.handler(event, {}, (err, img) => {
    console.log('pub', uid, img, err)
    publisher(conn, {
      uid: uid,
      err: err,
      src: img
    })
    cb()
  })
}

const consumer = (conn) => {
  conn.createChannel((err, ch) => {
    if (err != null) bail(err)

    ch.assertQueue(config.routing.sub)
    ch.consume(config.routing.sub, (msg) => {
      subscriber(conn, msg, () => {
        ch.ack(msg)
      })
    })
  })
}

amqlibCb.connect(config.connection.url, function(err, conn) {
  if (err != null) bail(err);

  consumer(conn)
});
