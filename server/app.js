const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const morganJson = require('morgan-json');
const {isCelebrate} = require('celebrate');
const logger = require('./src/config/logger');
const cors = require('cors');
const util = require('util');
const AppError = require('./src/errors/app');
require('./src/config/db');

const app = express();
// configuring the application
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// cors active
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// registering all our application routes
const registerAllRoutes = require('./src/app');

logger.stream = {
  write(message, encoding) {
    logger.info(message);
  },
};
// Create the request_id morgan token
morgan.token('request_id', (req, res) => req.id);

let morganFormat;
if (process.env.NODE_ENV === 'local') {
  morganFormat = 'combined';
} else {
  morganFormat = morganJson({
    'http.method': ':method',
    'http.url': ':url',
    'http.status_code': ':status',
    'http.referer': ':referrer',
    'http.useragent': ':user-agent',
    'http.request_id': ':request_id',
    'http.version': ':http-version',
    'http.remote-addr': ':remote-addr',
    'http.remote-user': ':remote-user',
    'http.length': ':res[content-length]',
    'response-time': ':response-time ms',
  });
}

app.use(morgan(morganFormat, {stream: logger.stream}));


registerAllRoutes(app);
// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.json(createError(404));
});
const getErrorResponse = (httpStatus, message) => ({
  error: {
    httpStatus: httpStatus,
    message: message,
  },
});


// error handler
app.use((err, req, res, next) => {
  logger.error(err);
  logger.error(util.inspect(err));
  logger.error(err.stack);

  if (isCelebrate(err)) {
    if (err.joi.details && err.joi.details.length > 0) {
      res.send(createError(400, err.joi.details[0].message));
    } else {
      res.send(createError(400, 'Input validation error'));
    }
  } else if (err.name === 'UnauthorizedError') {
    res.send(createError(
        401,
        'Unauthorized. Missing or invalid token',
    ));
  } else if (err instanceof AppError) {
    // All HTTP requests must have a response,
    // so let's send back an error with its httpStatus and message
    res.send(getErrorResponse(
        err.httpStatus,
        err.message,
    ));
  } else {
    // If it is an uncaught exception, pass it back as an Internal Server Error
    res.send(
        createError(
            500,
            'Looks like something went wrong.' +
        ' Please wait and try again in a few minutes.',
        ));
  }
});
module.exports = app;
