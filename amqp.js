"use strict";

const APP = require('./index')
const amqp = require('amqplib')
const config = require('./config/amqp')
const amqlibCb = require('amqplib/callback_api')

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
    pgoUsername: process.env.PGO_USERNAME, //|| 'petrivanovic101@gmail.com'), // 'anatolijvasickin@gmail.com'
    pgoPassword: process.env.PGO_PASSWORD, // || '2041651734561566042'), //'adjh321kdsaasd'
    pgoProvider: process.env.PGO_PROVIDER, // || 'google'),
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

amqlibCb.connect(config.connection.host, function(err, conn) {
  if (err != null) bail(err);

  consumer(conn)
});
