'use strict';

var nodemailer = require('nodemailer');
var config = require('../config/environment');


// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport('smtps://info%40naturenurture.lk:info@nnlk@smtp.zoho.com');

// setup e-mail data with unicode symbols
var mailOptions = {
  from: '"Nature Nurture" <info@naturenurture.lk>', // sender address
  //to: 'dumy.gm1@gmail.com', // list of receivers
  subject: 'Verify email', // Subject line
  //text: 'Hello world', // plaintext body
  //html: '<p>Lore</p>' // html body
};

var composeEmail = function(data) {
  return {
    text: "Thank you for signing up with naturenurture.lk. Please verify your email address by clicking the following link http://localhost:9000/api/users/verify/" + data.verification_code + ". If you did not signed up with naturenurture.lk please click the following link http://localhost:9000/api/users/discard/" + data.verification_code,
    html: "<b>Thank you for signing up with naturenurture.lk</b><br><p>Please verify your email address by clicking the following link<br>http://localhost:9000/api/users/verify/" + data.verification_code + "<br><br>If you did not signed up with naturenurture.lk please click the following link<br>http://localhost:9000/api/users/discard/" + data.verification_code + "</p><p>Thank you,<br>Nature Nurture team.</p>"
  }
}

module.exports = {

  sendVerification: function(data) {
    console.log(data)
    mailOptions.text = composeEmail(data).text;
    mailOptions.html = composeEmail(data).html;
    mailOptions.to = data.to;
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: ' + info.response);
    });
  }
}
