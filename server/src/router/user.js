var express = require('express');
var user = express.Router();
const request = require('request');
const jwt_decode = require('jwt-decode');
let lineLoginStates = {};
var AccountManager = require('../lib/account_manager.js');
var accountManager = new AccountManager();

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

const SUCCEED = 0;
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
user.post('/try_login', (req, res) => {
    var response;
    try {
        if (!accountManager.checkPassword(req.body.username, req.body.password)) {
            response = TRY_LOGIN[PASSWORD_INCORRECT];
            res.status(response.status).json(response.body);
            return;
        }
    } catch (error) {
        console.log(error);
        response = TRY_LOGIN[USER_NOT_FOUND];
        res.status(response.status).json(response.body);
        return;
    }
    
    response = TRY_LOGIN[SUCCEED]
    res.sendStatus(response.status);
    return;
});

const DUPLICATED_USER = 1;
const REGISTER = [
    {
        status: 200
    },
    {
        status: 201,
        body: {
            err_code: DUPLICATED_USER,
            err_msg: "duplicated user"
        }
    }
];
user.post('/register', (req, res) => {
    var response;
    let trimmedUsername = req.body.username.trim();
    let trimmedPassword = req.body.password.trim();
    console.log(trimmedUsername);
    try {
        accountManager.addUser(trimmedUsername, trimmedPassword);
    } catch (error) {
        response = REGISTER[DUPLICATED_USER];
        res.status(response.status).json(response.body);
        return;
    }
    response = REGISTER[SUCCEED];
    res.sendStatus(response.status);
    return;
});

user.post('/who', (req, res) => {
    let u = req.body.username;
    if (u) res.send(u);
    else res.sendStatus(401);
});

const BAD_REQUEST = 1;
const FOLLOW = [
    {
        status: 200
    },
    {
        status: 400,  // bad request
        body: {
            err_code: BAD_REQUEST,
            err_msg: "bad request"
        }
    }
]
user.post('/follow', sess, (req, res) => {
    var response;
    try {
        accountManager.setFollowRelation(
                req.body.username, req.body.target, req.body.follow_unfollow == "true");
        
    } catch (error) {
        console.log(`error is ${error}`);
        response = FOLLOW[BAD_REQUEST];
        response.body.err_msg = error;
        res.status(response.status).json(response.body);
        return;
    }
    response = FOLLOW[SUCCEED];
    res.sendStatus(response.status);
    return;
});

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
    try {
        let userInfo = accountManager.getUserInfo(req.query.id);
        res.send(userInfo);
    } catch (error) {
        let response = GET_PUBLIC_INFO[USER_NOT_FOUND];
        // it seems that with get method one can not send status and body
        // together, only post methond can do that
        // res.sendStatus(response.status).json(response.body);
        res.sendStatus(response.status);
        return;
    }
});

const line = require('../lib/line_login_request.js');
user.post('/line_login_req', (req, res) => {
    console.log(req.body);
    let newState = genNonce(5);
    let newNonce = genNonce(6);
    let req_body = {
        redirect_uri: 'http://localhost:2222/user/resolve_line_login',
        state: newState,
        nonce: newNonce
    }
    let stateInfo = {
        nonce: newNonce,
        succeed: false
    }
    lineLoginStates[newState] = stateInfo;
    res.send(line.getLineLoginUrl(req_body));
})

user.post('/login_state', sess, (req, res) => {

});


user.post('/line_login_state', sess, (req, res) => {
    // check if the given state of a line login has finished
    // if finished, switch the session?
    if (!(req.body.state in lineLoginStates)) {
        // pose an error
    }
    // pop the state from the list
    // and login the user?
})

user.get('/is_valid_username', sess, (req, res) => {
    let response = {
        isValid: false
    }
    response.isValid = !accountManager.hasUser(req.query.username);
    res.send(response);
});
    
user.get('/resolve_line_login', (req, res) => {
    console.log(`code = ${req.query.code}`);
    console.log(`state = ${req.query.state}`);
    
    // security check
    if (!(req.query.state in lineLoginStates)) {
        // the request is not from a trusted domain
        // i.e., not recorded by the server
        return;
    }
    let options = {
        uri: "https://api.line.me/oauth2/v2.1/token",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        form: {
            "grant_type": "authorization_code",
            "code": req.query.code,
            "redirect_uri": "http://localhost:2222/user/resolve_line_login",
            "client_id": "1655882165",
            "client_secret": "1d00fc1036dc3bddeed14772501d8d52"
        },
        method: "POST",
    };
    request(options, (err, res) => {
        if (err) {
            console.log(err);
            return;
        }
        let idToken = JSON.parse(res.body).id_token;
        let info = jwt_decode(idToken);
        console.log(info);
        if (info.nonce != lineLoginStates[req.query.state].nonce) {
            // abort the procedure due to the high risk of being replay attacked
            return;
        }
        if (accountManager.hasUser(info.name)) {
            // TODO: do the login for the old user
            console.log("old user");
            return;
        }
        accountManager.addUser(info.name, info.sub);
        lineLoginStates.state = true;
    });
    res.send("<script>window.close();</script>");
});

user.post('/get_id_by_name',(req,res)=>{
    res.send(accountManager.getIdbyUsername(req.body.name));

})

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

module.exports = user;