var nodemailer = require('nodemailer');
var mail_config = require('./mail_config');
const account_Manager = require('./account_manager.js');
var account_manager = new account_Manager();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : mail_config.user,
        pass : mail_config.pass,
    },
});
var status;

module.exports = function() {
    /**
     * @param {Srting} mailAddr
     * @returns if mailAddr is already in list
     * @throws any error happened
     */
    this.hasMailAddr = async function (mailAddr) {
      try {
        return await User.findOne({email: mailAddr})
          .exec()
          .then((addr) => {
            console.log(addr!= null);
            return addr != null;
          });
      } catch (error) {
        throw error;
      }
    };

    /**
     * @param {String} mailAddr
     * @returns if mailAddr is a valid email address
     */

    this.isValidAddr = (mailAddr) => { return isValidAddr(mailAddr) };

    /**
     * @param {String} mailAddr
     * @param {String} subject
     * @param {String} bodyText
     * @returns 200/401 if mail was sent suc/fail
     * @throws any error happened
     */

    this.sendMails = (mailAddr, subject, bodyText) => {
        var mailOptions = {
            from : 'noreply',
            to : mailAddr,
            subject : subject,
            text : bodyText,
        };
        var status = 401;
        try {
            transporter.sendMail(mailOptions, function(error, info) {
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
     * @param {String} EMAIL_SECRET
     * @param {String} serverUrl
     * @returns {object} status: 200/401 if mail was sent suc/fail
     * @returns {object} token: token sent to newUser
     * @throws any error happened
     */
    this.sendToken = (mailAddr, id, username, serverUrl, EMAIL_SECRET) => {
        var nonce = genNonce(20+Date.now()%6);
        console.log(nonce);
        account_manager.setNonceToUser(username, nonce).then(()=>{
            jwt.sign(
                {
                    user : id,
                    nonce: nonce,   
                },
                EMAIL_SECRET,
                {
                    expiresIn : '30m',
                },
                (err, emailToken) => {
                    const url = serverUrl + `/user/confirmation/${emailToken}`;
                    var html =
                        'Please click this link to confirm your email:<br><br>'+ `<a href="${
                            url}">Click me</a>`+'<br>The link above will expired within 30min<br><br>If you have no clue for this mail, just ignore it';
                    var sub = username + ' 這是你的驗證資訊 from learnen';
                    var mailOptions = {
                        from : 'noreply',
                        to : mailAddr,
                        subject : sub,
                        html : html,
                    };
                    var status = 401;
                    try {
                        transporter.sendMail(mailOptions, function(error, info) {
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
                    return {'token' : token, 'status' : status};
                },
            );

        }).catch((e)=>{
            console.log('This is caused by async but can be ignored:\n'+e);
        });
    };

    /**
     * To Verified user's email
     * @param {String} userId 
     * @throws "user not found"
     */
     this.verified = async function(targetId, nonce) {
        try {
            let target = await User.findById(targetId)
                                    .exec()
                                    .then((target) => {
                                        return target;
                                    });
            if(target){
                if(target.nonce == nonce){
                target.verified = true;
                target.save();
                return;
            }else
                throw "nonce not match";
            }
            }
            catch (error) {
                throw error;
            }
            throw "user not found";
        }
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
            characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return result.join('');
}

function isValidAddr(mailAddr) {
    const pattern =
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    // new RegExp(
    //  "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b");
    //console.log(pattern.test(mailAddr.toLowerCase()));
    return pattern.test(mailAddr.toLowerCase());
}
