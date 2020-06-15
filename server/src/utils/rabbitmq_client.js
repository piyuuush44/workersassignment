const amqp = require('amqplib/callback_api');

/**
 *This class represents an Rabbit mq Client.
 */
class RabbitmqClient {
  /**
   * RabbitMq Client constructor
   * @param {Object} opts options for RabbitMq Client
   */
  constructor(opts) {
    this.queue = opts.queueName || process.env.RABBIT_MQ_QUEUE;
    this.host = opts.host || process.env.RABBIT_MQ_HOST;
    this.message = opts.message;

    amqp.connect(this.host, (err, conn) => {
      if (err) {
        logger.error(err);
      }
      conn.createChannel((error, ch) => {
        if (error) {
          logger.error(error);
        }

        ch.assertQueue(this.queue, {durable: true});
        ch.sendToQueue(
            this.queue,
            Buffer.from(this.message),
            {persistent: true},
        );
        logger.info(`Sent ${this.message}`);
      });
    });
  }
}

module.exports = RabbitmqClient;
