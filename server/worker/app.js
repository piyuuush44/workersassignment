const QueueWorker = require('./src/queueWorker').worker();

const express = require('express');

const app = express();

// Set the logger
const logger = require('./src/config/logger');
require('./src/config/db');

/**
 *
 * Creates all the workers that will be run by the worker_service
 * @param {Array} workers array where all the workers will be stored
 */
function registerWorkers(workers) {
  workers.push(QueueWorker);
}

/**
 * Starts all worker_service workers
 * @param {Array} workers array of all workers that need to be started
 */
function startWorkers(workers) {
  workers.forEach((worker) => {
    logger.info(`Starting worker`);
    worker.start();
  });
}

// Tracks whether the process is shutting down or not
let shuttingDown = false;

/**
 * Adds a shutdown handlers that catches process SIGTERM/SIGINT signals and gracefully shuts the
 * workers down to prevent availability issues.
 * @param {Array} workers workers that need to be gracefully shut down
 * @param {Object} server Express server that needs to be shut down
 */
function addShutdownHandlers(workers, server) {
  // Handle SIGINT gracefully
  process.on('SIGINT', async () => {
    await handleShutdown(workers, server);
  });

  // Handle SIGTERM gracefully
  process.on('SIGTERM', async () => {
    await handleShutdown(workers, server);
  });
}

/**
 * This function takes care of the shutdown procedure
 * @param {Array} workers workers that need to be gracefully shut down
 * @param {Object} server Express server that needs to be shut down
 */
async function handleShutdown(workers, server) {
  logger.info('SIGTERM signal received');
  // If one shutdown signal was already received, then it's time to force shutdown
  if (shuttingDown) {
    logger.info('Second SIGTERM signal received. Shutting down now.');
    process.exit(1);
  }

  shuttingDown = true;

  logger.info('Shutting down health check server');
  server.close(() => {
    process.exit(0);
  });

  await Promise.all(workers.map(async (worker) => {
    while (worker.isRunning()) {
      logger.info(`Stopping worker ${worker.statsPrefix}`);
      worker.stop();

      // Sleep for a 1 second and check again
      await new Promise((resolve, reject) => {
        setTimeout((err) => {
          if (err) {
            return reject(err);
          }
          return resolve();
        }, 1000);
      });
    }
    logger.info(`Worker ${worker.statsPrefix} is stopped`);
  }));

  process.exit(0);
}

try {
  // All workers will be stored in this array
  const workers = [];

  // Set the health check route
  logger.info('Setting health check route');
  app.get('/health', (req, res) => {
    workers.forEach((worker) => {
      if (!worker.isHealthy) {
        return res.status(500)
            .send();
      }
      return res.status(200)
          .send();
    });
  });

  logger.info('Registering all workers');
  registerWorkers(workers);

  logger.info('Starting all workers');
  startWorkers(workers);

  // Start the health check server
  logger.info('Starting health check server');
  const server = app.listen(2368);
  logger.info('Started health check server');

  // Add shutdown handlers
  addShutdownHandlers(workers, server);
} catch (err) {
  if (err) {
    logger.error('err', err);
  }
  throw err;
}
