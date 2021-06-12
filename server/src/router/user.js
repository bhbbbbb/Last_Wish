/*************** Call modules **********************/
var express = require('express');
var user = express.Router();
var ip = require("ip");
const request = require('request');
const jwt_decode = require('jwt-decode');
const jwt = require('jsonwebtoken');
/*************** Call outer files *****************/
const MailManager = require('../lib/mail_manager.js');
var mailManager = new MailManager();
var AccountManager = require('../lib/account_manager.js');
var accountManager = new AccountManager();
var user_session = require('../lib/session.js');
const https_config = require('../../https.config');
/***************** Url Setting *******************/
const prefix = 'http://'
var port = https_config.port;
var frontPort = 8080;
const serverUrl = prefix + ip.address() + ':' + port;
const frontUrl  = prefix + ip.address() + ':' + frontPort;
/***************** Others *************************/
const EMAIL_SECRET = 'df45ea4g684AgpfsdSDLK4W6sdfsdg54asd4fgsljopa'
let lineLoginStates = {};
// the following API is to test the db
user.get('/get_all_users', user_session, (_req, res) => {
    accountManager.getAllUsers();
    res.sendStatus(200);
})

user.get('/clear_all_users', user_session, (_req, res) => {
    accountManager.clearAllUsers();
    res.sendStatus(200);
})

const SUCCEED = 0;
const USER_NOT_FOUND = 1;
const PASSWORD_INCORRECT = 2;
const NO_VERIFIED = 3;
const TRY_LOGIN = [
    {status : 200}, 
    {
        status : 401,
        body : {err_code : USER_NOT_FOUND, err_msg : "user not found"}
    },
    {
        status : 401,
        body : {err_code : PASSWORD_INCORRECT, err_msg : "password is incorrect"}
    },
    {
        status: 203,
        body : {err_code: NO_VERIFIED, err_msg : "Please check the confirmation mail first"}
    }
];
user.post('/try_login', user_session, (req, res) => {
    //console.log(serverUrl);
    accountManager.checkPassword(req.body.username, req.body.password)
        .then((result) => {
            if(!result.verified){
                mailManager.sendToken(result.email, result.userId, req.body.username, serverUrl, EMAIL_SECRET);
                let response = TRY_LOGIN[NO_VERIFIED]
                res.status(response.status).json(response.body);
            }else if (result.correct) {
                let response = TRY_LOGIN[SUCCEED]
                req.session.username = req.body.username;
                // notice thate 'id' cannot be set in session
                req.session.user_id = result.userId;
                res.status(response.status).json({
                    username : req.body.username,
                    id : req.session.user_id
                });
            } else {
                response = TRY_LOGIN[PASSWORD_INCORRECT];
                res.status(response.status).json(response.body);
            }
        })
        .catch((error) => {
            console.log(error);
            let response = TRY_LOGIN[USER_NOT_FOUND];
            res.status(response.status).json(response.body);
        });
    return;
});

const DUPLICATED_USER = 1;
const DUPLICATED_EMAIL = 2;
const INVALID_ADDR = 3;
const EMAIL_ERR = 4;
const REGISTER = [
    {status : 200}, 
    {
        status : 201,
        body : {err_code : DUPLICATED_USER, err_msg : "duplicated user"}
    },
    {
        status : 202, 
        body : {err_code : DUPLICATED_EMAIL, err_msg : "duplicated email"}
    },
    {
        status : 203,
        body : {err_code : INVALID_ADDR, err_msg : "invalid email address"}
    },
    {
        status : 204,
        body : {err_code : EMAIL_ERR, err_msg : "email sent failed"}
    },    
];



user.post('/register', (req, res) => {
    console.log(req.body);
    var addr = req.body.email.toLowerCase();
    if(!mailManager.isValidAddr(addr)){
        let response = REGISTER[INVALID_ADDR];
        res.status(response.status).json(response.body);
        console.log(response.body);
    }
    else {
        mailManager.hasMailAddr(addr).then((result)=>{
            if(result){
            console.log(mailManager.hasMailAddr(addr));
            let response = REGISTER[DUPLICATED_EMAIL];
            res.status(response.status).json(response.body);
            console.log(response.body);
        }else{
            let trimmedUsername = req.body.username.trim();
            let trimmedPassword = req.body.password.trim();
            accountManager.addUser(trimmedUsername, trimmedPassword, addr)
                .then((id) => {
                    let response = REGISTER[SUCCEED];
                    console.log(id);
                    try{
                        mailManager.sendToken(addr, id, trimmedUsername, serverUrl, EMAIL_SECRET);
                        res.sendStatus(response.status);
                        //console.log(addr);
                    }catch(e){
                        console.log(e);
                        let response = REGISTER[EMAIL_ERR];
                        res.status(response.status).json(response.body);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    let response = REGISTER[DUPLICATED_USER];
                    res.status(response.status).json(response.body);
                });
    }
    })
    }

});

user.post('/set_self_intro', user_session, (req, res) => {
    accountManager
        .setSelfIntroToUser(req.session.user_id, req.body.self_intro)
        .then(() => {
            res.sendStatus(200);
        })
        .catch((error) => {
            console.log(error);
            res.status(400).json(error);
        })
});

user.post('/set_honor', user_session, (req, res) => {
    accountManager
        .setHonorToUser(req.session.user_id, req.body.honor)
        .then(() => {
            res.sendStatus(200);
        })
        .catch((error) => {
            console.log(error);
            res.status(400).json(error);
        })
});

user.post('/set_pro_pic', user_session, (req, res) => {
    accountManager
        .setProPicToUser(req.session.user_id, req.body.pro_pic_url)
        .then(() => {
            res.sendStatus(200);
        })
        .catch((error) => {
            console.log(error);
            res.status(400).json(error);
        })

          });

user.get('/who', user_session, (req, res) => {
    let u = req.session.username;
    if (u)
        res.send({username : u, id : req.session.user_id});
    else
        res.sendStatus(401);
});

user.post('/toggle_followed_user', user_session, (req, res) => {
    accountManager
        .toggleFollowRelation(req.session.user_id, req.body.target_id)
        .then(() => {
            res.sendStatus(200);
        })
        .catch((error) => {
            console.log(error);
            res.status(400).json(error);
        })
});

user.post('/toggle_followed_post', user_session, (req, res) => {
    accountManager
        .toggleFollowedPostsToUser(req.session.user_id, req.body.article_id)
        .then(() => {
            res.sendStatus(200);
        })
        .catch((error) => {
            console.log(error);
            res.status(400).json(error);
        })
});

user.post('/toggle_liked_post', user_session, (req, res) => {
    accountManager
        .toggleLikedPostsToUser(req.session.user_id, req.body.article_id)
        .then(() => {
            res.sendStatus(200);
        })
        .catch((error) => {
            console.log(error);
            res.status(400).json(error);
        })
});

user.get('/logout', user_session, (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
})

const GET_PUBLIC_INFO = [
    {status : 200},
    {
        status : 400, // bad request
        body : {
            err_code : USER_NOT_FOUND,
            err_msg : "there is no user with such id"
        }
    }
];
// retrieve public info of a username by its user's ID
user.get('/get_public_info', (req, res) => {
    accountManager.getUserInfo(req.query.id)
        .then((userInfo) => {
            let response = GET_PUBLIC_INFO[SUCCEED];
            res.status(response.status).json(userInfo);
        })
        .catch((error) => {
            console.log(error);
            let response = GET_PUBLIC_INFO[USER_NOT_FOUND];
            // it seems that with get method one can not send status and body
            // together, only post methond can do that
            // res.sendStatus(response.status).json(response.body);
            res.sendStatus(response.status);
        });
});

const line = require('../lib/line_login_request.js');
const mail_manager = require('../lib/mail_manager.js');
user.post('/line_login_req', (req, res) => {
    let newState = genNonce(5);
    let newNonce = genNonce(6);
    let req_body = {
        redirect_uri : 'http://localhost:2222/user/resolve_line_login',
        state : newState,
        nonce : newNonce
    };
    let stateInfo = {nonce : newNonce, succeed : false};
    lineLoginStates[newState] = stateInfo;
    res.send(line.getLineLoginUrl(req_body));
});

user.get('/is_valid_username', user_session, (req, res) => {
    accountManager.hasUser(req.query.username)
        .then((exist) => { res.send(!exist); })
        .catch((error) => {
            console.log(error);
            res.sendStatus(400);
        });
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
        uri : "https://api.line.me/oauth2/v2.1/token",
        headers : {"Content-Type" : "application/x-www-form-urlencoded"},
        form : {
            "grant_type" : "authorization_code",
            "code" : req.query.code,
            "redirect_uri" : "http://localhost:2222/user/resolve_line_login",
            "client_id" : "1655882165",
            "client_secret" : "1d00fc1036dc3bddeed14772501d8d52"
        },
        method : "POST",
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

user.get('/get_id_by_name', (req, res) => {
    accountManager.getIdbyUsername(req.query.name)
        .then((id) => { res.send(id); })
        .catch((error) => {
            console.log(error);
            res.sendStatus(400);
        });
});

user.get('/confirmation/:token', async (req, res) => {
    try {
        const {user : id} = jwt.verify(req.params.token, EMAIL_SECRET);
        if(id){
        mailManager.verified(id).then(()=>{
            return res.redirect(frontUrl);
        }
        ).catch(e=>{
        res.send('<p>Token expired</p>');
        console.log(e);
        })
    }else{
        res.send('<p>Token expired</p>');
    }
        // models.User.update({confirmed : true}, {where : {id}});
    } catch (e) {
        res.send('<p>Token expired</p>');
    }
});

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

module.exports = user;