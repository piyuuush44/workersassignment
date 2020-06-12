const Controller = require('../controllers/auth');
const Schema = require('../schema/auth');

module.exports = [
// apis for auth
  {
    // Register a new user
    method: 'get',
    route: '/health',
    controller: Controller.getHealth,
  },
];
