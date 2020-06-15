const asyncHandler = require('express-async-handler');
const Message = require('../../../models/message');
const ClientError = require('../../../errors/client');

/**
 * This method checks if message id passed via param is valid or not
 * and returns 401 if its invalid
 */
exports.checkMessageExists = asyncHandler(async (req, res, next) => {
  const {id} = req.params;
  const message =await Message.findById(id);
  if (!message) {
    return next(new ClientError({message: `Message not found for id: ${id}`}));
  }
  req.message = message;
  next();
});
