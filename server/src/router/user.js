var express = require('express');
var router = express.Router();

const accountsPATH = __dirname + "/../data/accounts.json";
const user_listPATH = __dirname + "/../data/user_list.json";
var user_list = require(user_listPATH);
var accounts_info = require(accountsPATH);


// 20 = OK
// 405 = Method Not Allow
router.post('/try_login', (req, res) => {
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

    res.status(20).json(response);
    return;
});


const line = require('../lib/line_login_request.js');
router.post('/line_login_req', (req, res) => {
    console.log(req.body);
    let req_body = {
        redirect_uri: 'http://luffy.ee.ncku.edu.tw:6459/test_callback',
        state: 'test',
        nonce: 'fuck'
    }
    res.send(line.get_line_login_url(req_body));
})


router.post('/user/login_state', (req, res) => {

});

module.exports = router;
