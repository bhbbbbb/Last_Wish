var nodemailer = require('nodemailer');
var mail_config = require('./mail_config');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: mail_config.user,
    pass: mail_config.pass,
  },
});

module.exports= function(){
    /**
     * @param {String} mailAddr 
     * @param {String} sub //subject of mail
     * @param {String} txt //body of mail
     * @returns 200/401 if mail was sent suc/fail
     */
    this.sendMails = (mailAddr,sub,txt) => {
      var mailOptions = {
      from: 'noreply',
      to: mailAddr,
      subject: sub,
      text: txt,
      };
      var status = 401;
      transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
        status = 401;
      } else {
        console.log('Email sent: ' + info.response);
        status = 200;
      }
      });
      return status;
    }
}



