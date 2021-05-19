const nodemailer = require('nodemailer')
let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: 'EMAIL', // replace this string with a real world password
    pass: 'PASSWORD' // and put your password here
  }
});

transporter.verify().then(() => {
  console.log('Ready to send email');
})


module.exports = transporter;
