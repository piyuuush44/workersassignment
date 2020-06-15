const logger = require('./config/logger');
const amqp = require('amqplib/callback_api');

/**
 * This class represents an Rabbit Mq Worker, i.e a worker that continually
 * polls an Rabbit Queue and workers on the messages/tasks received.
 *
 * Internally it uses amqplib library to handle the boiler plate code of polling
 * messages.
 * Any Rabbit Mq based workers should create an instance of this class
 * and pass in the function name
 */
class RabbitMqWorker {
  /**
   * SqsWorker constructor
   * @param {Object} opts options for RabbitMq Worker
   * @param {string} opts.host Optional Rabbitmq client.
   * @param {string} opts.queueName Rabbit Queue name that will be polled worker
   *  received.
   * @param {function} fn function to execute after receiving message.
   */
  constructor(opts, fn) {
    if (!fn) {
      throw new Error('Function to execute is mandatory');
    }
    this.fn = fn;
    this.host = opts.host || process.env.RABBIT_MQ_HOST;
    this.queue = opts.queueName;

    // Initialize the health check variable
    this.healthy = true;
    logger.info(`Created rabbit mq worker for ${this.queue}`);
  }

  /**
   * Starts polling the Rabbit queue
   */
  start() {
    // connecting to rabbitmq
    amqp.connect(this.host, (err, connection) => {
      if (err) {
        logger.error(err);
      }
      // creating channel
      connection.createChannel((error, channel) => {
        if (error) {
          logger.error(error);
        }
        this.channel = channel;
        // asserting the queue
        channel.assertQueue(this.queue, {durable: true});
        // listeining to messages
        channel.consume(this.queue, (msg) => {
          try {
            this.fn(msg);
            // acknowledging the message as if processed successfully
            channel.ack(msg);
          } catch (e) {
            logger.error('Some error occured! Message can not be acknowledged');
          }
        }, {noAck: false});
      });
    });
  }

  /**
   * Stops polling the Rabbit queue
   */
  stop() {
    this.channel.close();
  }

  /**
   * Checks whether the worker is healthy or not.
   * @return {boolean} true if the worker is healthy. false otherwise.
   */
  isHealthy() {
    return this.healthy;
  }
}

module.exports = RabbitMqWorker;
