const nodemailer = require("nodemailer");

const SendEmail = (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMPT_HOST,
    port: process.env.SMPT_PORT,
    service: process.env.SMPT_SERVICE,
    secure: false,
    requireTLS: false,
    auth: {
      user: process.env.SMPT_ADMIN_EMAIL,
      pass: process.env.SMPT_ADMIN_PASSWORD,
    },
  });
  const mailOptions = {
    from: process.env.SMPT_ADMIN_EMAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  transporter.sendMail(mailOptions);
};

module.exports = SendEmail;
