const dockerRabbitUrl = `amqp://${ process.env.RABBITMQ_A80AD340_PORT_5672_TCP_ADDR  }`
const url = process.env.NODE_ENV == 'production' ? dockerRabbitUrl : 'amqp://localhost'

// var rabbitLogin    = process.env.RABBIT_LOGIN    || 'guest';
// var rabbitPassword = process.env.RABBIT_PASSWORD || 'guest';

const routingPub     = process.env.ROUTING_PUB     || 'pg.worker.out';
const routingSub     = process.env.ROUTING_SUB     || 'pg.worker.in';

module.exports = {
  routing: {
    pub: routingPub,
    sub: routingSub
  },
  connection: {
    url: url,
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
