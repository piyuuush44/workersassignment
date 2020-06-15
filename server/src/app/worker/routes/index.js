const main = require('./main');

module.exports = () => {
  let routes = [];

  routes = routes.concat(main);

  routes.forEach((r) => {
    r.route = `/worker${r.route}`;
  });

  return routes;
};
