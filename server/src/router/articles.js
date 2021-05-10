const articlePATH = __dirname + "/../data/articles.json";
const accountsPATH = __dirname + "/../data/accounts.json";
var express = require('express');
var global = express.Router();
// const { stringify } = require('querystring');
var articles = require(articlePATH);
// var accounts = require(accountsPATH);
// The line above can be replaced with
var AccountManager = require('../lib/account_manager.js');
var accountManager = new AccountManager();
var ArticleManager = require('../lib/article_manager.js');
var articleManager = new ArticleManager();
// to handle issues that is to do with user
// also I wrote a new class to handle articles: article_manager
// it would be more elegant to utilize the class 
// but maybe update later today

var d = new Date();
var month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
var today = month[d.getMonth()] + ' ' + String(d.getDate()) + ', ' + days[d.getDay()];

// add a post anonymously
global.post('/insert', (req, res) => {
    // here may simply call addPostsToAuthor method of account_manager
    // let newArticleId = articles.length;
    // req.body["id"] = String(newArticleId);
    // req.body["from"] = String(-1);
    // req.body["date"] = today;

    // articles.push(req.body);
    // let str = JSON.stringify(articles, null, 4);
    // res.send(str)
    // fs.writeFile(articlePATH, str, (err) => {
    //     if (err) console.log(err);
    // });
    articleManager.addArticle(req.body);
    res.status(200).json(articleManager.getAllArticles());
    return;
});

global.post('/addcomment', (req, res) => {
    
    //console.log(req.body.author,req.body.article_id,req.body.comment,'QQ');
    articleManager.addCommentToArticle(req.body.author,req.body.article_id,req.body.comment);
    res.send('cool');
});

global.get('/count', (req, res) => {
    res.send(articles.length);
});

global.get('/', (req, res) => {
    res.json(articleManager.getAllArticles());
});

const BAD_REQUEST = 1;
const USER_POST = [
    {
        status: 200
    },
    {
        status: 400,  // bad request
        body: {
            err_code: BAD_REQUEST,
            err_msg: ""
        }
    }
]
global.get('/user_post', (req, res) => {
    // // here may simply call getPostsByUser method of account_manager
    // var User_id = String(-1);   //Here can be replaced with api returns current user's id
    // var UserPost = [];
    // for(var i = 0;i<articles.length;i++)
    //     if(articles[i].from === User_id)
    //         UserPost.push(articles[i]);
    // //console.log(UserPost);
    // res.json(UserPost);
    // //TODO: Deal with some exception 
    var response;
    let posts = [];
    try {
        accountManager.getPostsByAuthor(req.query.username).forEach(articleId => {
            posts.push(articleManager.getArticleById(articleId));
        });
    } catch (error) {
        response = USER_POST[BAD_REQUEST];
        res.status(response.status).json(response.body);
        return;
    }
    response = USER_POST[SUCCEED];
    res.status(response.status).json(posts);
    return;
});

const USER_NOT_FOUND = 1;
const FOLLOWED_POST = [
    {
        status: 200
    },
    {
        status: 400,  // bad request
        body: {
            err_code: BAD_REQUEST,
            err_msg: ""
        }
    }
]
global.get('/followed_post', (req, res) => {
    // var User_id = String(0);   //Here can be replaced with api returns current user's id
    // var F_User = [];
    // var F_Post = [];
    // var Total_Post = [];
    // for(var i = 0;i<articles.length;i++)
    //     if(accounts[i].id === User_id){
    //         F_User=accounts[i].followees;
    //         F_Post=accounts[i].followedPosts;
    //         //console.log(F_User,F_Post,F_User[1]);
    //         break;
    //     }
    
    // if(F_User.length)
    // for(var i = 0;i<F_User.length;i++)
    //     for(var k in articles){
    //         if(articles[k].from==F_User[i])
    //             Total_Post.push(articles[k]);
    //         console.log(articles[k].from,F_User[i]);
    //         }

    // if(F_Post.length)
    // for(var j in F_Post)
    //     for(var k in articles)
    //         if(articles[k].id==F_Post[j])
    //             Total_Post.push(articles[k]);
    // //TODO: Deal with some exception 
    // res.json(Total_Post);
    var response;
    let posts = [];
    try {
        accountManager.getFollowedPostsByUser(req.query.username).forEach(articleId => {
            posts.push(articleManager.getArticleById(articleId));
        });
    } catch (error) {
        response = FOLLOWED_POST[USER_NOT_FOUND];
        response.body.err_msg = error;
        res.status(response.status).json(response.body);
        return;
    }
    response = FOLLOWED_POST[SUCCEED];
    res.status(response.status).json(posts);
    return;
});

const SUCCEED = 0;
const POST = [
    {
        status: 200
    },
    {
        status: 400,  // bad request
        body: {
            err_code: USER_NOT_FOUND,
            err_msg: "user not found"
        }
    }
]
// a user post a post
global.post('/post', (req, res) => {
    var response;
    try {
        accountManager.addPostsToAuthor(
                req.body.username, req.body.article);
    } catch (error) {
        response = POST[USER_NOT_FOUND];
        res.status(response.status).json(response.body);
        return;
    }
    response = POST[SUCCEED];
    res.status(response.status).json(response.body);
    return;
});

module.exports = global;