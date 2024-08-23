const nodemailer = require("nodemailer");

const SendEmail = async (options) => {
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
    ...(options.html ? { html: options.template } : { text: options.message }),
  };

 await transporter.sendMail(mailOptions).then(()=>{
  console.log("email sent successfully")
 }).catch((err)=>{
  console.log(`Error in sending email: ${err}`)
 });
};

module.exports = SendEmail;
