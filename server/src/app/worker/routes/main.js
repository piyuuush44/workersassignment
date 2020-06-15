const Controller = require('../controllers/main');
const Schema = require('../schema/main');
const Middlewares = require('../middlewares/main');

module.exports = [
  {
    // Register a new message
    method: 'post',
    route: '/messages',
    controller: Controller.postMessage,
    schema_validation: Schema.postMessage,
  },
  {
    method: 'get',
    route: '/messages',
    controller: Controller.getMessages,
  },
  {
    method: 'put',
    route: '/message/:id',
    controller: Controller.putMessageStatus,
    schema_validation: Schema.putMessageUpdate,
    middlewares: [
      Middlewares.checkMessageExists,
    ],
  },
  {
    method: 'delete',
    route: '/message/:id',
    controller: Controller.deleteMessage,
    schema_validation: Schema.deleteMessage,
    middlewares: [
      Middlewares.checkMessageExists,
    ],
  },
];
