// const nodemailer = require("nodemailer")
// require('dotenv').config()

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.Sender_Email,
//       pass: process.env.Sender_Mail_Password
//     }
//   });
  
//   // Function to send an email
//   function sendEmail(message) {
//     const mailOptions = {
//       from: process.env.Sender_Email,
//       to: process.env.Admin_Email,
//       subject: "Warning message",
//       text: message
//     };
  
//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.error('Error sending email:', error);
//       } else {
//         console.log('Email sent:', info.response);
//       }
//     });
//   }

//   module.exports={
//     sendEmail
//   }