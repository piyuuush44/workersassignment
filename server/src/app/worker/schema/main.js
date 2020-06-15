const {Joi} = require('celebrate');

module.exports = {
  postMessage: {
    body: Joi.object()
        .keys({
          to: Joi.string().email().required(),
          content: Joi.string().required(),
          time: Joi.number(),
          priority: Joi.number(),
        }),
  },
  putMessageUpdate: {
    params: {
      id: Joi.string().required(),
    },
    body: Joi.object()
        .keys({
          status: Joi.string().required(),
        }),
  },
  deleteMessage: {
    params: {
      id: Joi.string().required(),
    },
  },
};
