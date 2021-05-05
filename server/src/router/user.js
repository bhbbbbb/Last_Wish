var express = require('express');
var user = express.Router();
var fs = require("fs");
const request = require('request');
const jwt_decode = require('jwt-decode');

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
    }
})

// 200 = OK
// 405 = Method Not Allow
user.post('/try_login', sess, (req, res) => {
    let response = {
        err_msg: "",
    };
    if (!(req.body.username in user_list)) {
        response.err_msg = "user not found";
        res.status(405).json(response);
        return;
    }
    let user_id = Number(user_list[req.body.username]);
    if (accounts_info[user_id].password != req.body.password) {
        response.err_msg = "password not matched";
        res.status(405).json(response);
        return;
    }
    
    req.session.username = req.body.username;
    res.sendStatus(200);
    return;
});

user.post('/register', sess, (req, res) => {
    let response = {
        err_msg: "",
    };
    let trimmedUsername = req.body.username.trim();
    let trimmedPassword = req.body.password.trim();
    console.log(trimmedUsername);
    if (trimmedUsername in user_list) {
        response.err_msg = "duplicated user";
        res.status(405).json(response);
        return;
    }
    let newUserId = String(Object.keys(user_list).length);
    user_list[trimmedUsername] = newUserId;
    let new_account_info = {
       "id": newUserId,
       "username": trimmedUsername,
       "password": trimmedPassword
    };
    accounts_info.push(new_account_info);
    let user_list_data = JSON.stringify(user_list, null, 4);
    let accounts_info_data = JSON.stringify(accounts_info, null, 4);
    fs.writeFile(user_listPATH, user_list_data, (err) => {
        if (err) console.log(err);
    });
    fs.writeFile(accountsPATH, accounts_info_data, (err) => {
        if (err) console.log(err);
    });
    res.sendStatus(200);
    return;
});

user.get('/who', sess, (req, res) => {
    console.log(req.session);
    let u = req.session.username;
    if (u) res.send(u);
    else res.sendStatus(403);
});

user.get('/logout', sess, (req, res) => {
    console.log(req.session, '\ntry logout');
    req.session.destroy();
    res.sendStatus(200);
})

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

user.post('/login_state', sess, (req, res) => {

});

user.post('/is_valid_username', sess, (req, res) => {
    let response = {
        isValid: false
    }
    response.isValid = !(req.body.username in user_list);
    res.send(response);
});
    
function getUserByName(username) {
    return accounts_info[Number(user_list[username])];
}

module.exports = user;
