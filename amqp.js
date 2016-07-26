"use strict";

const APP = require('./index')
const config = require('./config/amqp')
const user = require('./config/user')
const amqlibCb = require('amqplib/callback_api')

console.log(config)
console.log(user)

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
  const { uid, location } = JSON.parse(msg.content.toString())
  const event = {
    debug: false,
    pgoUsername: user.username,
    pgoPassword: user.password, // || '2041651734561566042'), //'adjh321kdsaasd'
    pgoProvider: user.provider, // || 'google'),
    pgoLocation: location
  }
  console.log(event)

  APP.handler(event, {}, (err, img) => {
    console.log('APP.handler-done', 2)
    publisher(conn, {
      uid: uid,
      err: err,
      img: img
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
