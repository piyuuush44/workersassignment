const elasticsearch = require('elasticsearch');
const logger = require('../config/logger');

/**
 * This class represents an Elasticsearch client
 * */
class ElasticClient {
  /**
     * Elasticsearch client constructor
     * @param {Object} opts options for Elasticsearch client
     */
  constructor(opts) {
    this.host = opts.host || 'elasticsearch-server:9200';
    this.client = new elasticsearch.Client({
      host: `${this.host}`,
      log: 'trace',
    });

    this.client.ping({
      // ping usually has a 3000ms timeout
      requestTimeout: 1000,
    }, function(error) {
      if (error) {
        logger.error('elasticsearch cluster is down!');
      } else {
        logger.info('All is well in elastic search');
      }
    });
  }

  /**
     * Creates a new index in es
     * @param {string} name of index to be created
     * @return {Promise}
     * */
  async createIndex(name) {
    return new Promise((resolve, reject) => {
      this.client.indices.create(
          {index: name},
          (err, resp, status) => {
            if (err) {
              logger.error(err);
              return reject(err);
            } else {
              return resolve(resp);
            }
          });
    });
  }

  /**
     * Creates a new index in es
     * @param {string} indexName name of index to which we need to put mapping
     * @param {string} mappingType type of mapping ie structure of our doc
     * @param {Object} mapping data to put
     * @return {Promise}
     * */
  async putMappingToIndex(indexName, mappingType, mapping) {
    return this.client.indices.putMapping(
        {
          index: indexName,
          type: mappingType,
          body: mapping,
        },
    );
  }

  /**
     * Inserts data to a particular index
     * @param {string} indexName name of index to which we need to put mapping
     * @param {string} _id id of index
     * @param {Object} mappingType type of mapping ie structure of our doc
     * @param {Object} data: data to insert in es
     * */
  async indexData(indexName, _id, mappingType, data) {
    return this.client.index(
        {
          index: indexName,
          type: mappingType,
          id: _id,
          body: data,
        },
    );
  }

  /**
     * Inserts data to a particular index
     * @param {string} indexName name of index to which we need search by id
     * @param {string} _id id of index you want to search
     * @param {string} mappingType type of mapping ie structure of our doc
     * */
  async getById(indexName, _id, mappingType) {
    return this.client.get(
        {
          index: indexName,
          type: mappingType,
          id: _id,
          ignore: 404,
        },
    );
  }

  /**
     * Update data of a particular index
     * @param {string} indexName name of index to which we need search by id
     * @param {string} _id id of index you want to search
     * @param {string} mappingType type of mapping ie structure of our doc
     * @param {Object} data: data to insert in es
     * */
  async updateById(indexName, _id, mappingType, data) {
    return this.client.update(
        {
          index: indexName,
          type: mappingType,
          id: _id,
          body: {
            doc: data,
          },
        },
    );
  }
}

module.exports = ElasticClient;
