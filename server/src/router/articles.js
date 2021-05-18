const articlePATH = __dirname + "/../data/articles.json";
const accountsPATH = __dirname + "/../data/accounts.json";
var express = require('express');
var global = express.Router();

// const { stringify } = require('querystring');
// var articles = require(articlePATH);
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


const SUCCEED = 0;
const USER_NOT_FOUND = 1;
const INSERT = [
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
global.post('/insert', (req, res) => {
    var response;
    try {
        accountManager.addPostsToAuthor(
                req.body.username, req.body.article);
    } catch (error) {
        console.log(error);
        response = INSERT[USER_NOT_FOUND];
        res.status(response.status).json(response.body);
        return;
    }
    response = INSERT[SUCCEED];
    res.status(response.status).json(response.body);
    return;
});

global.post('/addcomment', (req, res) => {
    
    //console.log(req.body.author,req.body.article_id,req.body.comment,'QQ');
    articleManager.addCommentToArticle(req.body.author,req.body.article_id,req.body.comment);
    res.send('cool');
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
global.post('/user_post', (req, res) => {

    var response;
    let posts = [];
    try {
        accountManager.getPostsByAuthor(req.body.username).forEach(articleId => {
            posts.push(articleManager.getArticleById(articleId));
        });
    } catch (error) {
        response = USER_POST[BAD_REQUEST];
        res.status(response.status).json(response.body);
        return;
    }
    response = USER_POST[SUCCEED];
    console.log(posts);
    res.status(response.status).json(posts);
    return;
});

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
global.post('/followed_post', (req, res) => {
    var response;
    let posts = [];
    try {
        accountManager.getFollowedPostsByUser(req.body.username).forEach(articleId => {
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
global.post('/addMilestone',(req,res)=>{
    articleManager.addMilestoneToArticle(req.body.article_id,req.body.newMilestone);
    res.send(articleManager.getToday(2));
})

global.post('/FollowedPostToggle',(req,res)=>{
    console.log(req.body);
    try{
    accountManager.toggleFollowedPostsToUser(req.body.username,req.body.articleId);
    }catch(err){
        console.log(err);
    }
    res.sendStatus(200);
})




module.exports = global;