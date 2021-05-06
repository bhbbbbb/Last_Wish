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

let lineLoginStates = {};

// 200 = OK
// 405 = Method Not Allow
user.post('/try_login', sess, (req, res) => {
    let response = {
        err_msg: "",
    };
    if (!(req.body.username in user_list)) {
        response.err_msg = "user not found";
        res.status(401).json(response);
        return;
    }
    let user_id = Number(user_list[req.body.username]);
    if (accounts_info[user_id].password != req.body.password) {
        response.err_msg = "password is not correct";
        res.status(401).json(response);
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
        "password": trimmedPassword,
        "followers": [],
        "followees": [],
        "followedPosts": []
    };
    accounts_info.push(new_account_info);
    synchronizeUserList();
    synchronizeAccountsInfo();
    res.sendStatus(200);
    return;
});

user.get('/who', sess, (req, res) => {
    console.log(req.session);
    let u = req.session.username;
    if (u) res.send(u);
    else res.sendStatus(403);
});

user.post('/follow', sess, (req, res) => {
    let follower = accounts_info.find(account => account['username'] == req.body.username)
    let followee = accounts_info.find(account => account['username'] == req.body.target)
    if (!(follower)) {
        return;
    }
    if (!(followee)) {
        return;
    }
    // dirty code, fix later
    followeeList = follower.followees;
    followerList = followee.followers;
    if (req.body.follow_unfollow == "true") {
        // follow
        if (followeeList.find(id => id == followee.id)) {
            console.log("already followed");
            return;
        }
        followeeList.push(followee.id);
        followerList.push(follower.id);
    } else {
        // unfollow
        if (!followeeList.find(id => id == followee.id)) {
            console.log("already unfollowed");
            return
        }
        followeeList.splice(followeeList.indexOf(followee.id), 1);
        followerList.splice(followerList.indexOf(follower.id), 1);
    }
    console.log(followeeList);
    synchronizeAccountsInfo();
    res.send("here");
});

user.get('/logout', sess, (req, res) => {
    console.log(req.session, '\ntry logout');
    req.session.destroy();
    res.sendStatus(200);
})

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
    res.send(line.get_line_login_url(req_body));
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

user.post('/is_valid_username', sess, (req, res) => {
    let response = {
        isValid: false
    }
    response.isValid = !(req.body.username in user_list);
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
    var idToken;
    request(options, (err, res) => {
        if (err) {
            console.log(err);
            return;
        }
        idToken = JSON.parse(res.body).id_token;
        let info = jwt_decode(idToken);
        if (info.nonce != lineLoginStates[req.query.state].nonce) {
            // abort the procedure due to the high risk of being replay attacked
            return;
        }
        if (info.name in user_list) {
            // TODO: do the login for the old user
            console.log("old user");
            return;
        }
        console.log(info);
        user_list[info.name] = newUserId;
        let newUserId = String(Object.keys(user_list).length);
        let new_account_info = {
           "id": newUserId,
           "username": info.name,
           "password": info.sub,
            "followers": [],
            "followees": [],
            "followedPosts": []
        };
        accounts_info.push(new_account_info);
        synchronizeUserList();
        synchronizeAccountsInfo();
        lineLoginStates[state] = true;
        console.log("succeed");
    })
    res.send("<script>window.close();</script>");
});
    
function synchronizeUserList() {
    let user_list_data = JSON.stringify(user_list, null, 4);
    fs.writeFile(user_listPATH, user_list_data, (err) => {
        if (err) console.log(err);
    });
}    

function synchronizeAccountsInfo() {
    let accounts_info_data = JSON.stringify(accounts_info, null, 4);
    fs.writeFile(accountsPATH, accounts_info_data, (err) => {
        if (err) console.log(err);
    });
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

module.exports = user;
