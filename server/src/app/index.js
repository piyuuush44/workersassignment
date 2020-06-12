const asyncHandler = require('express-async-handler');
const {celebrate} = require('celebrate');
const workerRoutes = require('./worker/routes')();

module.exports = (app) => {
  let routes = [];

  routes = routes.concat(workerRoutes);

  routes.forEach((r) => {
    const args = [];
    args.push(r.route);
    if (r.schema_validation) {
      args.push(celebrate(r.schema_validation));
    }
    if (r.middlewares && r.middlewares.length > 0) {
      r.middlewares.forEach((m) => args.push(m));
    }
    if (r.controller) {
      args.push(asyncHandler(r.controller));
    }
    app[r.method](...args);
  });
};
