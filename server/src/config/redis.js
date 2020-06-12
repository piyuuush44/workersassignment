const redis = require('redis');
const client = redis.createClient({host: 'redis-server', port: '6379'});

client.on('error', function(error) {
  console.error(error);
});

module.exports = redis;
