const config = require('../config/amqp')
const amqlibCb = require('amqplib/callback_api')

const bail = (err) => {
  console.error(err)
  process.exit(1)
}

const errorHandler = (err) => {
  if (err != null) bail(err)
}

const connectChannel = (cb) => {
  amqlibCb.connect(config.connection.url, (err, conn) => {
    errorHandler(err)
    conn.createChannel((err, ch) => {
      errorHandler(err)
      cb(ch)
    })
  })
}

const pubEvent = (ch, event) => {
  let msg, headers

  msg = new Buffer(JSON.stringify(event))
  headers = {contentType: 'application/json'}

  ch.assertQueue(config.routing.pub)
  ch.sendToQueue(config.routing.pub, msg, headers)
}

const subEvent = (ch, handler) => {
  const cb = (event) => {
    // event = { uid, coords{latitude,longitude} }

    const { uid, coords } = JSON.parse(msg.content.toString())
    const ack = () => {
      ch.ack(msg)
    }

    handler(uid, coords, ack)
  }

  ch.assertQueue(config.routing.sub)
  ch.consume(config.routing.sub, cb)
}

module.exports = {
  pub: (event) => {
    connectChannel((ch) => {
      pubEvent(ch, event)
    })
  },
  sub: (handler) => {
    connectChannel((ch) => {
      subEvent(ch, handler)
    })
  }
}
