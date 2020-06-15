const ClientError = require('../../../errors/client');
const Message = require('../../../models/message');
const RabbitMqClient = require('../../../utils/rabbitmq_client');
const ElasticSearchClient = require('../../../utils/elasticsearch_client');
const constants = require('../../../config/constants');

const elasticSearch = new ElasticSearchClient(
    {
      // eslint-disable-next-line max-len
      host: `${process.env.ELASTIC_SEARCH_HOST}:${process.env.ELASTIC_SEARCH_PORT}`,
    },
);

const constructorOptions = {
  queueName: process.env.RABBIT_MQ_QUEUE,
  host: process.env.RABBIT_MQ_HOST,
  message: '',
};

/*
* Creates a new message in mongo and enqueue it to rabbitmq message queue
* */
exports.postMessage = async (req, res, next) => {
  try {
    const stages = [];
    stages.push({stage: 'created', time: Date.now()});

    const message = new Message();
    message.status = 'created';
    message.time = req.body.time;
    message.stages = stages;
    message.content = req.body.content;
    message.to = req.body.to;
    message.priority = req.body.priority;
    await message.save();

    const rabbitMqMessage = {
      time: req.body.time,
      content: req.body.content,
      to: req.body.to,
      _id: message._id,
    };
    constructorOptions.message = JSON.stringify(rabbitMqMessage);
    new RabbitMqClient(constructorOptions);

    const elasticSearchData = JSON.stringify({
      stages: stages,
    });
    await elasticSearch.indexData(
        constants.ELASTICSEARCH_INDEX_NAME,
        message._id.toString(),
        constants.ELASTICSEARCH_MAPPING_TYPE_NAME,
        elasticSearchData,
    );
    return res.json({
      message: ' Message posted successfully',
      result: {
        message: message,
      },
    });
  } catch (e) {
    logger.error(e);
    return next(new ClientError({message: 'Some error occured!'}));
  }
};

/*
* Returns all the messages
* */
exports.getMessages = async (req, res, next) => {
  const messages = await Message.find();
  return res.json({
    message: 'All Messages returned successfully',
    result: {
      message: messages,
    },
  });
};

/*
* Update a message status
* */
exports.putMessageStatus = async (req, res, next) => {
  const {message} = req;

  const stages = message.stages;
  stages.push({stage: 'updated', time: Date.now()});

  message.stages = stages;
  message.status = req.body.status;
  await message.save();

  return res.json({
    result: {
      message: message,
    },
    message: 'Message updated successfullyu',
  });
};

/*
* Delete a message by id
* */
exports.deleteMessage = async (req, res, next) => {
  const {message} = req;

  const stages = message.stages;
  stages.push({stage: 'deleted', time: Date.now()});

  message.stages = stages;
  message.status = 'deleted';
  message.is_deleted = true;
  await message.save();

  return res.json({
    message: 'Message deleted successfullyu',
  });
};
