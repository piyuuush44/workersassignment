const auth = require('./auth');

module.exports = () => {
  let routes = [];

  routes = routes.concat(auth);

  routes.forEach((r) => {
    r.route = `/worker${r.route}`;
  });

  return routes;
};
