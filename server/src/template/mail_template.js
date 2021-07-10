

module.exports = function() {
    /**
     * 
     * @param {object} user 
     * @param {String} serverUrl 
     * @param {String} emailToken 
     * @returns 
     */

    this.makeTokenMail = (user, serverUrl, emailToken) => {
    const url = serverUrl + `/user/confirmation/${emailToken}`;
    var html =
        'Please click this link to confirm your email:<br><br>'+ `<a href="${
        url}">Click me</a>`+'<br>The link above will expired within 30min<br><br>If you have no clue of this mail, just ignore it';
    var sub = user.username + ' 這是你的驗證資訊 from Lernen';
    var mailOptions = {
        from : 'Lernen confirm mail <no-reply@Lernen.com>',
        replyTo:'no-reply@Lernen.com',
        to : user.email,
        subject : sub,
        html : html,
        };
        return mailOptions;
    };

    /**
     * @param {object} user 
     * @param {String} serverUrl 
     * @param {String} emailToken 
     * @returns 
     */
    this.makeResetPassMail = (user, serverUrl, emailToken) =>{
        const url = serverUrl + `/user/confirmation/${emailToken}`;
        var html =
            'Please click this link to activate your new password:<br>'+ `<a href="${
                url}">Click me</a>`+'<br>Your password will remain unchanged until you click the link\
                <br>The link above will expired within 30min\
                <br>If you have no clue of this mail, just ignore it';
        var sub = user.username + '的密碼重啟驗證信 from Lernen';
        var mailOptions = {
            from : 'Lernen confirm mail <no-reply@Lernen.com>',
            replyTo:'no-reply@Lernen.com',
            to : user.email,
            subject : sub,
            html : html,
        };
        return mailOptions;
    }
    
    /**
     * @param {String} mailAddr 
     * @param {String} subject 
     * @param {String} bodyText 
     * @returns 
     */
    this.makeNormalMail = (mailAddr, subject, bodyText) => {
        var mailOptions = {
            from : 'Lernen <no-reply@Lernen.com>',
            replyTo : 'no-reply@Lernen.com',
            to : mailAddr,
            subject : subject,
            text : bodyText,
        };
        return mailOptions;
    }

}
