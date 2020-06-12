// const {Joi} = require('celebrate');
// const constants = require('../../../utils/constants');
//
// module.exports = {
//   postRegister: {
//     body: Joi.object()
//         .keys({
//           password: Joi.string().required(),
//           email: Joi.string().email().lowercase().required(),
//         }),
//   },
//   postLogin: {
//     body: Joi.object()
//         .keys({
//           password: Joi.string().required(),
//           email: Joi.string().email().lowercase().required(),
//         }),
//   },
//   postPasswordReset: {
//     body: Joi.object()
//         .keys({
//           password: Joi.string().required(),
//         }),
//   },
//   putProfileUpdate: {
//     params: {
//       id: Joi.string().required(),
//     },
//     body: Joi.object()
//         .keys({
//           first_name: Joi.string().required(),
//           last: Joi.string().required(),
//           phone: Joi.string().valid(constants.PHONE_REGEX).required(),
//         }),
//   },
// };
