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
  amqlibCb.connect(config.connection.url, config.socket, (err, conn) => {
    errorHandler(err)
    conn.createChannel((err, ch) => {
      errorHandler(err)
      cb(ch, conn)
    })
  })
}

const assertQueue = (ch, routing, cb) => {
  ch.assertQueue(config.routing.sub, config.queue, (err, ok) => {
    if (err) {
      bail(err)
    } else {
      ch.prefetch(1)
      cb(ch)
    }
  })
}

const pubEvent = (ch, event) => {
  let msg, headers

  msg = new Buffer(JSON.stringify(event))

  assertQueue(ch, config.routing.pub, (ch) => {
    ch.sendToQueue(config.routing.pub, msg, config.push)
  })
}

const subEvent = (ch, handler) => {
  const cb = (msg) => {
    const event = JSON.parse(msg.content.toString())
    const ask = () => { ch.ack(msg) }

    handler(event, ask)
  }

  assertQueue(ch, config.routing.sub, (ch) => {
    ch.consume(config.routing.sub, cb, config.sub)
  })
}

module.exports = {
  pub: (event) => {
    connectChannel((ch, conn) => {
      pubEvent(ch, event)
      setTimeout(conn.close.bind(conn), 100)
    })
  },
  sub: (handler) => {
    connectChannel((ch, conn) => {
      subEvent(ch, handler)
    })
  }
}
