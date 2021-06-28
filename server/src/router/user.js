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
const AccountManager = require('../lib/account_manager.js');
var accountManager = new AccountManager();
var user_session = require('../lib/session.js');
const https_config = require('../../https.config');
/***************** Url Setting *******************/
const prefix = https_config.https_enable ? 'https://' : 'http://'
var port = https_config.port;
var frontPort = 8080;
const SERVER_URL = prefix + ip.address() + ':' + port;
const FRONT_URL  = prefix + ip.address() + ':' + frontPort;
/***************** Others *************************/
const EMAIL_SECRET = 'df45ea4g684AgpfsdSDLK4W6sdfsdg54asd4fgsljopa'

// the following API is to test the db
user.get('/get_all_users', user_session, (_req, res) => {
    accountManager.getAllUsers();
    res.sendStatus(200);
});

const SUCCEED = 0;
const USER_NOT_FOUND = 1;
const PASSWORD_INCORRECT = 2;
const NO_VERIFIED = 3;
const TRY_LOGIN = [
    {
        status: 200
    }, 
    {
        status: 401,
        body: { err_code: USER_NOT_FOUND, err_msg: "user not found" }
    },
    {
        status: 401,
        body: { err_code: PASSWORD_INCORRECT, err_msg: "password is incorrect" }
    },
    {
        status: 401,
        body: { err_code: NO_VERIFIED, err_msg: "Check confirm mail first" }
    }
];
user.post('/try_login', user_session, async (req, res) => {
    try {
        const exist = await accountManager.hasUser(req.body.username);
        if (!exist) {
            let response = TRY_LOGIN[USER_NOT_FOUND];
            res.status(response.status).json(response.body);
        } else { 
            const result = await accountManager.checkPassword(req.body.username, req.body.password);
            if (!result.verified) {
                let response = TRY_LOGIN[NO_VERIFIED]
                res.status(response.status).json(response.body);
            } else if (result.correct) {
                let response = TRY_LOGIN[SUCCEED]
                req.session.username = req.body.username;
                req.session.user_id = result.userId;
                res.status(response.status).json({
                    username: req.body.username,
                    id: req.session.user_id
                });
            } else {
                response = TRY_LOGIN[PASSWORD_INCORRECT];
                res.status(response.status).json(response.body);
            }
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
    return;
});

const DUPLICATED_USER = 1;
const DUPLICATED_EMAIL = 2;
const INVALID_ADDR = 3;
const EMAIL_ERR = 4;
const REGISTER = [
    {
        status: 200
    }, 
    {
        status: 400,
        body: { err_code: DUPLICATED_USER, err_msg: "duplicated user" }
    },
    {
        status: 400, 
        body: { err_code: DUPLICATED_EMAIL, err_msg: "duplicated email" }
    },
    {
        status: 400,
        body: { err_code: INVALID_ADDR, err_msg: "invalid email address" }
    },
    {
        status: 500,
        body: { err_code: EMAIL_ERR, err_msg: "email sent failed" }
    },    
];
user.post('/register', async (req, res) => {
    let addr = req.body.email.toLowerCase();
    if (!mailManager.isValidAddr(addr)) {
        let response = REGISTER[INVALID_ADDR];
        res.status(response.status).json(response.body);
    } else {
        let trimmedUsername = req.body.username.trim();
        let trimmedPassword = req.body.password.trim();
        const result = await mailManager.hasMailAddr(addr);
        const invalid = await accountManager.hasUser(trimmedUsername);
        if (result) {
            let response = REGISTER[DUPLICATED_EMAIL];
            res.status(response.status).json(response.body);
        } else if (invalid) {
            let response = REGISTER[DUPLICATED_USER];
            res.status(response.status).json(response.body);
        } else {
            const id = await accountManager.addUser(trimmedUsername, trimmedPassword, addr);
            let response = REGISTER[SUCCEED];
            try {
                mailManager.sendToken(addr, id, trimmedUsername, SERVER_URL, EMAIL_SECRET);
                res.sendStatus(response.status);
            } catch (e) {
                console.log(e);
                let response = REGISTER[EMAIL_ERR];
                res.status(response.status).json(response.body);
            }
        }
    }
});

user.post('/set_self_intro', user_session, async (req, res) => {
    try {
        await accountManager.setSelfIntroToUser(req.session.user_id, req.body.self_intro);
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
});

// user.post('/set_honor', user_session, async (req, res) => {
//     try {
//         await accountManager.setHonorToUser(req.session.user_id, req.body.honor);
//         res.sendStatus(200);
//     } catch (error) {
//         console.log(error);
//         res.status(400).json(error);
//     }
// });

user.post('/set_pro_pic', user_session, async (req, res) => {
    try {
        await accountManager.setProPicToUser(req.session.user_id, req.body.pro_pic_url);
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
});

user.get('/who', user_session, (req, res) => {
    let u = req.session.username;
    if (u)
        res.send({ username: u, id: req.session.user_id });
    else
        res.sendStatus(401);
});

user.post('/toggle_followed_user', user_session, async (req, res) => {
    try {
        await accountManager.toggleFollowRelation(req.session.user_id, req.body.target_id);
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
});

user.post('/set_followed_post', user_session, async (req, res) => {
    try {
        let set = (typeof req.body.set === 'boolean')? req.body.set : req.body.set === "true";
        await accountManager.setFollowedPostsToUser(req.session.user_id, req.body.article_id, set);
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
});

user.post('/set_liked_post', user_session, async (req, res) => {
    try {
        let set = (typeof req.body.set === 'boolean')? req.body.set : req.body.set === "true";
        await accountManager.setLikedPostsToUser(req.session.user_id, req.body.article_id, set);
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
});

user.get('/logout', user_session, (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
});


const GET_PUBLIC_INFO = [
    {
        status : 200
    },
    {
        status: 400, // bad request
        body: {
            err_code: USER_NOT_FOUND,
            err_msg: "there is no user with such id"
        }
    }
];
user.get('/get_public_info', async (req, res) => {
    try {
        let userInfo = await accountManager.getUserInfo(req.query.id);
        let response = GET_PUBLIC_INFO[SUCCEED];
        res.status(response.status).json(userInfo);
    } catch (error) {
        console.log(error);
        let response = GET_PUBLIC_INFO[USER_NOT_FOUND];
        res.status(response.status).json(response.body);
    }
});

user.get('/is_valid_username', user_session, async (req, res) => {
    try {
        let exist = await accountManager.hasUser(req.query.username);
        res.send(!exist);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});

user.get('/get_id_by_name', async (req, res) => {
    try {
        let id = await accountManager.getIdByUsername(req.query.name);
        res.send(id);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});
const LINK_EXPIRED = (` \
    <p>很抱歉，這個連結已經失效了</p> \
    <p>We\'re sorry, the link has expired.</p> \
    <a href=${FRONT_URL}>回到首頁</a> \
`);

user.get('/confirmation/:token', async (req, res) => {
    try {
        const { user: id, nonce: nonce, pass: cryptPass} = jwt.verify(req.params.token, EMAIL_SECRET);
        if (id) {
            const result = await mailManager.verified(id, nonce, cryptPass);
            if (result) {
                // TODO: Auto logged in
                res.redirect(FRONT_URL);
                return;
            }
        }
        res.send(LINK_EXPIRED);
    } catch (error) {
        res.send(LINK_EXPIRED);
    }
});

const VERIFIED = 2;
const SEND_TOKEN = [
    {
        status: 200
    }, 
    {
        status: 400,
        body: { err_code: USER_NOT_FOUND, err_msg: "user not found" }
    },
    {
        status: 400,
        body: { err_code: VERIFIED, err_msg: "Email has confirmed" }
    },
    {},
    {
        status: 400,
        body: { err_code: EMAIL_ERR, err_msg: "Email send error occured" }
    },
];
user.get('/send_token_mail', user_session, async (req, res) => {
    const result = await accountManager.checkVerified(req.query.username);
    if (result == null) {
        let response = SEND_TOKEN[USER_NOT_FOUND];
        res.status(response.status).json(response.body); 
    } else if (result.verified) {
        let response = SEND_TOKEN[VERIFIED];    //User is verified, no need to send mail again;
        res.status(response.status).json(response.body); 
    } else {
        try {
            mailManager.sendToken(result.email, result.id, req.query.username, SERVER_URL, EMAIL_SECRET);
            let response = SEND_TOKEN[SUCCEED];
            res.status(response.status).json(response.body);
        } catch(error) {
            let response = SEND_TOKEN[EMAIL_ERR];
            res.status(response.status).json(response.body); 
        }
    }
});

user.post('/add_event_to_user', user_session, async (req, res) => {
    let newEvent = {
        "name": req.body.name,
        "color": req.body.color,
        "start": req.body.start,
        "end": req.body.end,
        "finished": req.body.finished
    };
    let userId = req.session.user_id;
    try {
        let event_id = await accountManager.addEventToUser(newEvent, userId);
        res.status(200).json(event_id);
        return;
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
        return;
    }
});

user.get('/get_events', user_session, async (req, res) => {
    let userId = req.session.user_id;
    try {
       let result = await accountManager.getUserEvent(userId);
       res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});

user.post('/edit_event_by_id', user_session, async (req, res) => {
    let eventId = req.body.event_id;
    let modifiedEvent = {
        "name": req.body.name,
        "color": req.body.color,
        "start": req.body.start,
        "end": req.body.end,
        "finished": req.body.finished
    };
    let userId = req.session.user_id;
    try {
       let result = await accountManager.editEventById(eventId, userId, modifiedEvent);
       res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});

user.post('/set_finished_event', user_session, async (req, res) => {
    let eventId = req.body.event_id;
    let set = (typeof req.body.set === 'boolean')? req.body.set : req.body.set === "true";
    let userId = req.session.user_id;
    try {
       await accountManager.setFinishedEventById(eventId, userId, set);
       res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});

user.get('/get_liked_posts', user_session, async (req, res) => {
    try {
        let userId = req.session.user_id;
        let articleIds = await accountManager.getUserLiked(userId);
        if (articleIds)
            res.status(200).json(articleIds);
        else
            res.sendStatus(400);
    } catch (error) {
        res.sendStatus(500);
    }
});

user.post('/reset_pass', user_session, async (req, res) => {
    try {
        let userId = req.session.user_id;
        let username = req.body.username;
        let pass = req.body.new_pass;
        let user = [];
        if(!userId)
            user = await accountManager.findUserbyUsername(username);
        else
            user = await accountManager.findUserById(userId);
        if(!pass || !user){
            res.sendStatus(400);
            return;
        }
        let hash = await accountManager.hashPass(pass);
        await mailManager.sendResetPass(user.email, user._id, user.username, SERVER_URL, EMAIL_SECRET, hash);
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
})

user.post('/reset_email', user_session, async (req, res) => {
    try {
        userId = req.session.user_id;
        let email = req.body.new_email;
        let pass = req.body.password;
        let check1 = await mailManager.hasMailAddr(email);
        let check2 = mailManager.isValidAddr(email);
        if (check1) {
            let response = REGISTER[DUPLICATED_EMAIL];
            res.status(response.status).json(response.body);
            return;
        } else if (!check2) {
            let response = REGISTER[INVALID_ADDR];
            res.status(response.status).json(response.body);
            return;
        } else {
            let correct = await accountManager.setEmailToUser(userId, pass, email);
            if(correct) {
                res.sendStatus(200);
            } else {
                let response = {
                    err_code: 4,
                    err_msg: "Wrong password"
                }
                res.status(400).json(response);
            }
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
})

module.exports = user;