var express = require('express');
var user = express.Router();

const accountsPATH = __dirname + "/../data/accounts.json";
const user_listPATH = __dirname + "/../data/user_list.json";
var user_list = require(user_listPATH);
var accounts_info = require(accountsPATH);


// Set sessoin's config (https://www.npmjs.com/package/express-session)
var session = require('express-session')
var sess = session({
    name: 'threesmall',
    secret: 'u6m04fu/ 20 ',
    resave: false,
    saveUninitialized: false,//
    cookie: {
        secure: false, // set true for https
        maxAge: 86400000, // 1 day
        // sameSite: 'none',
    }
})


const USER_NOT_FOUND = 1;
const PASSWORD_INCORRECT = 2;
const TRY_LOGIN = [
    {
        status: 200
    },
    {
        status: 401,
        body: {
            err_code: USER_NOT_FOUND,
            err_msg: "user not found"
        }
    },
    {
        status: 401,
        body: {
            err_code: PASSWORD_INCORRECT,
            err_msg: "password is incorrect"
        }
    }
];
user.post('/try_login', sess, (req, res) => {

    if (!(req.body.username in user_list)) {
        res.status(401).json(TRY_LOGIN[USER_NOT_FOUND].body);
        return;
    }
    let user_id = Number(user_list[req.body.username]);
    if (accounts_info[user_id].password != req.body.password) {
        res.status(401).json(TRY_LOGIN[PASSWORD_INCORRECT].body);
        return;
    }
    
    req.session.username = req.body.username;
    res.sendStatus(200);
    return;
});









// get current username depend on session
user.get('/who', sess, (req, res) => {
    let u = req.session.username;
    if (u) res.send(u);
    else res.sendStatus(403);
});












// logout and clear corresponding session
user.get('/logout', sess, (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
})







const GET_PUBLIC_INFO = [
    {
        status: 200
    },
    {
        status: 400, // bad request
        body: {
            err_code: USER_NOT_FOUND,
            err_msg: "there is no user with such id"
        }
    }
];
// retrieve public info of a username by its user's ID
user.get('/get_public_info', (req, res) => {
    let id = Number(req.query.id);

    if (id >= accounts_info.length) {
        res.sendstatus(400).json(GET_PUBLIC_INFO[USER_NOT_FOUND].body);
    }
    
    let body = {
        id: id,
        username: accounts_info[id].username,
        // TODO check the condition that username may be undefined
        // e.g. account is deleted
    }

    res.status(200).json(body);
});







const line = require('../lib/line_login_request.js');
user.post('/line_login_req', (req, res) => {
    console.log(req.body);
    let req_body = {
        redirect_uri: 'http://luffy.ee.ncku.edu.tw:6459/test_callback',
        state: 'test',
        nonce: 'fuck'
    }
    res.send(line.get_line_login_url(req_body));
})


user.post('/login_state', (req, res) => {

});

module.exports = user;
