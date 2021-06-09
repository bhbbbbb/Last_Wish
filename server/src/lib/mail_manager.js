var nodemailer = require('nodemailer');
var mail_config = require('./mail_config');
//const User = require('../models/User');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: mail_config.user,
    pass: mail_config.pass,
  },
});
var status;

module.exports = function () {
  // /**
  //  * @param {Srting} mailAddr
  //  * @returns if mailAddr is already in list
  //  * @throws any error happened
  //  */
  // this.hasMailAddr = async function (mailAddr) {
  //   try {
  //     return await User.findOne({email: mailAddr})
  //       .exec()
  //       .then((addr) => {
  //         return addr != null;
  //       });
  //   } catch (error) {
  //     throw error;
  //   }
  // };

  /**
   * @param {String} mailAddr
   * @returns if mailAddr is a valid email address
   */

  this.isValidAddr = (mailAddr) => {
    return isValidAddr(mailAddr);
  };

  /**
   * @param {String} mailAddr
   * @param {String} subject
   * @param {String} bodyText
   * @returns 200/401 if mail was sent suc/fail
   * @throws any error happened
   */

  this.sendMails = (mailAddr, subject, bodyText) => {
    var mailOptions = {
      from: 'noreply',
      to: mailAddr,
      subject: subject,
      text: bodyText,
    };
    var status = 401;
    try {
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          throw error;
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      status = 200;
    } catch (e) {
      status = 401;
    }
    return status;
  };

  /**
   * @param {String} mailAddr
   * @param {String} username
   * @returns {object} status: 200/401 if mail was sent suc/fail
   * @returns {object} token: token sent to newUser
   * @throws any error happened
   */

  this.sendToken = (mailAddr, username) => {
    var token = genNonce(25 + (Date.now() % 6));
    var text = '哈囉 ' + username + '\n下面是你的驗證碼:\n' + token;
    var sub = username + ' 這是你的驗證資訊 from lernen';
    var mailOptions = {
      from: 'noreply',
      to: mailAddr,
      subject: sub,
      text: text,
    };
    var status = 401;
    try {
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          throw error;
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      status = 200;
    } catch (e) {
      status = 401;
    }
    return {token: token, status: status};
  };
};

/**
 * @param {int} length
 * @returns A string of random chars with length = input
 */
function genNonce(length) {
  let result = [];
  let characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result.push(
      characters.charAt(Math.floor(Math.random() * charactersLength))
    );
  }
  return result.join('');
}

function isValidAddr(mailAddr) {
  var pattern =
    "A[a-z0-9!#$%&'*+/=?^_‘{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_‘{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?z";
  return mailAddr.match(pattern);
}
