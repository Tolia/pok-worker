var rabbitUrl      = process.env.RABBIT_URL      || 'amqp://localhost';
var rabbitLogin    = process.env.RABBIT_LOGIN    || 'guest';
var rabbitPassword = process.env.RABBIT_PASSWORD || 'guest';
var routingPub     = process.env.ROUTING_PUB     || 'pg.worker.out';
var routingSub     = process.env.ROUTING_SUB     || 'pg.worker.in';

module.exports = {
  routing: {
    pub: routingPub,
    sub: routingSub
  },
  connection: {
    url: rabbitUrl,
    noDelay: true,
    ssl: {
      enabled: false
    }
  },
  subscribe: {
    ack: true,
    prefetchCount: 1
  },
  queue: {
    passive: false,
    durable: true,
    exclusive: false,
    autoDelete: false,
    noDeclare: false,
    closeChannelOnUnsubscribe: false
  }
};
