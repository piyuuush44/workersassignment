const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_SECRET_KEY,
  },
});

exports.sendEmail = (mailOptions) => new Promise((resolve, reject) => {
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      return reject(error);
    } else {
      logger.info('Email sent: ' + info.response);
      return resolve(true);
    }
  });
});
