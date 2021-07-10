var nodemailer = require('nodemailer');
var mail_config = require('../config/mail.config');
const AccountManager = require('./account_manager.js');
var accountManager = new AccountManager();
const MailTemplate = require('../template/mail_template');
var mailTemplate = new MailTemplate();
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
     * @param {object} user
     * @param {String} serverUrl
     * @param {String} EMAIL_SECRET
     * @param {String} cryptPass
     * @returns {object} status: 200/401 if mail was sent suc/fail
     * @returns {object} token: token sent to newUser
     */
    this.sendResetPassMail = async(user, serverUrl, EMAIL_SECRET, cryptPass) => {
        var nonce = genNonce(20 + Date.now() % 6);
        await accountManager.setNonceToUser(user._id, nonce);

        let emailToken = jwt.sign(
            {
                user : user._id,
                nonce: nonce,
                pass: cryptPass,
            },
            EMAIL_SECRET,
            {
                expiresIn : '30m',
            }
        );

        var mailOptions = 
        mail_template.makeResetPassMail(user, serverUrl, emailToken);
        try {
            transporter.sendMail(mailOptions);
        } catch(e) {
            throw "Email sent failed"
        }
    };
    /**
     * @param {Srting} mailAddr
     * @returns if mailAddr is already in list
     * @throws any error happened
     */
    this.hasMailAddr = async function (mailAddr) {
        try {
            return await User.findOne({ email: mailAddr }) != null;                 
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
        var mailOptions = mailTemplate.makeNormalMail(mailAddr, subject, bodyText);
        var status = 401;
        try {
            transporter.sendMail(mailOptions);
            status = 200;
        } catch (error) {
            status = 401;
        }
        return status;
    };

    /**
     * @param {object} user
     * @param {String} serverUrl
     * @param {String} EMAIL_SECRET
     * @throws any error happened when sending mail
     */
    this.sendToken = async(user, serverUrl, EMAIL_SECRET) => {
        var nonce = genNonce(20 + Date.now() % 6);
        await accountManager.setNonceToUser(user._id, nonce);
        let emailToken = jwt.sign(
            {
                user : user._id,
                nonce: nonce,   
            },
            EMAIL_SECRET,
            {
                expiresIn : '30m',
            }
        );
        var mailOptions = 
        mailTemplate.makeTokenMail(user, serverUrl, emailToken);
        try {
            transporter.sendMail(mailOptions);
        } catch(e) {
            throw "Email sent failed"
        }
    };

    /**
     * @param {String} targetId 
     * @param {String} nonce 
     * @throws "user not found"
     */
    this.verified = async function(targetId, nonce) {
        try {
            let target = await User.findById(targetId);
            if(!target)
                return false;
            if (target.nonce === nonce) {
                target.verified = true;
                target.nonce = '';
                await target.save();
                return true;
            } 
        } catch (error) {
            return false;
        }
    }
    /**
     * 
     * @param {String} targetId 
     * @param {String} nonce 
     * @param {String} cryptPass 
     * @returns 
     */
    this.setNewPass = async function(targetId, nonce, cryptPass) {
        try {
            let target = await User.findById(targetId);
            if(!target)
                return false;
            if (target.nonce === nonce) {
                target.password = cryptPass;
                target.nonce = '';
                await target.save();
                return true;
            } 
        } catch (error) {
            return false;
        }
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
