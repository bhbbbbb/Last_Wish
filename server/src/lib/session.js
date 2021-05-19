// Set sessoin's config (https://www.npmjs.com/package/express-session)
var session = require('express-session')
module.exports = session({
    name: 'user_session',
    secret: 'u6m04fu/ 20 ',
    resave: false,
    saveUninitialized: false,//
    cookie: {
        secure: false, // set true for https
        maxAge: 86400000, // 1 day
        // sameSite: 'none',
    }
})