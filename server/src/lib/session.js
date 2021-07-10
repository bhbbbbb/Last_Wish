// Set sessoin's config (https://www.npmjs.com/package/express-session)
var session = require('express-session')
const https_config = require('../config/https.config');
const https_enable = https_config.https_enable;

module.exports = session({
    name: 'user_session',
    secret: 'u6m04fu/ 20 ',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: https_enable,
        maxAge: 30 * 86400000, // 1 month
        sameSite: https_enable ? 'none' : 'lax',
    }
})