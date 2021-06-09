var nodemailer = require('nodemailer');
var mail_config = require('./mail_config');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: mail_config.user,
    pass: mail_config.pass,
  },
});
var status;

module.exports= function(){
    /**
     * @param {String} mailAddr 
     * @param {String} subject 
     * @param {String} bodyText
     * @returns 200/401 if mail was sent suc/fail
     */
    this.sendMails = (mailAddr,subject,bodyText) => {
      var mailOptions = {
      from: 'noreply',
      to: mailAddr,
      subject: subject,
      text: bodyText,
      };
      var status = 401;
     try{
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            throw error;
          } else {
            console.log('Email sent: ' + info.response);
          }
          })
        status = 200;
        }
      catch(e){
        status = 401;
        }
        return status;
    }

    /**
     * @param {String} mailAddr 
     * @param {String} username
     * @returns {object} status: 200/401 if mail was sent suc/fail
     * @returns {object} token: token sent to newUser
     */


    this.sendToken = (mailAddr,username) =>{
      var token = genNonce(25+Date.now()%6);
      var text = '哈囉 ' + username +'\n下面是你的驗證碼:\n'+token;
      var sub = username + ' 這是你的驗證資訊 from lernen';
      var mailOptions = {
      from: 'noreply',
      to: mailAddr,
      subject: sub,
      text: text,
      };
      var status = 401;
      try{
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            throw error;
          } else {
            console.log('Email sent: ' + info.response);
          }
        })
        status = 200;
        }catch(e){
          status = 401;
        }
      return {'token':token,'status':status};
    }


}



function genNonce(length) {
    let result           = [];
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result.push(
          characters.charAt(Math.floor(Math.random() * charactersLength)));
   }
   return result.join('');
}
