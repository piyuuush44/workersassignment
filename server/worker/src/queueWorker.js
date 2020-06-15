const logger = require('../src/config/logger');
const emailClient = require('./utils/email_client');
const RabbitMqWorker = require('./rabbitMqWorker');
const Message = require('./models/message');
const constants = require('./config/constants');

const ElasticSearchClient = require('./utils/elasticsearch_client');
const elasticClient = new ElasticSearchClient(
    {
      // eslint-disable-next-line max-len
      host: `${process.env.ELASTIC_SEARCH_HOST}:${process.env.ELASTIC_SEARCH_PORT}`,
    },
);

const constructorOptions = {
  queueName: process.env.RABBIT_MQ_QUEUE,
  host: process.env.RABBIT_MQ_HOST,
};

const messageHandler = async (message) => {
  const finalMessage = JSON.parse(message.content);
  const messageById = await Message.findById(finalMessage._id);

  // updating elastic search index data for this id
  const elasticSearchData = await elasticClient.getById(
      constants.ELASTICSEARCH_INDEX_NAME,
      finalMessage._id.toString(),
      constants.ELASTICSEARCH_MAPPING_TYPE_NAME,
  );

  try {
    const mailOptions = {
      from: process.env.EMAIL_ID,
      to: finalMessage.to,
      subject: process.env.EMAIL_SUBJECT,
      text: finalMessage.content,
    };
    await emailClient.sendEmail(mailOptions);

    // message executed successfully
    messageById.status = 'done';
    await messageById.save();
    // updating in es
    if (elasticSearchData._source) {
      const newStage = elasticSearchData._source.stages;
      newStage.push({stage: 'executed', time: Date.now()});

      await elasticClient.updateById(
          constants.ELASTICSEARCH_INDEX_NAME,
          finalMessage._id.toString(),
          constants.ELASTICSEARCH_MAPPING_TYPE_NAME,
          {stages: newStage},
      );
    }
  } catch (e) {
    if (elasticSearchData._source) {
      const newStage = elasticSearchData._source.stages;
      newStage.push({stage: 'halted', time: Date.now()});

      await elasticClient.updateById(
          constants.ELASTICSEARCH_INDEX_NAME,
          finalMessage._id.toString(),
          constants.ELASTICSEARCH_MAPPING_TYPE_NAME,
          {stages: newStage},
      );
    }

    logger.error(e);
    throw new Error(e);
  }
};
/**
 * This class represents an RabbitMq Generic Worker,
 * i.e it continuously pools the notification queue for messages
 *
 * Internally it uses amqb library to handle the boiler plate code of polling
 * It instantiates the RabbitMq Worker's generic class with a queue url,host
 * @return {RabbitMqWorker} returns and rabbit_mq_worker's class
 * */
exports.worker = () => new RabbitMqWorker(
    constructorOptions, messageHandler,
);
