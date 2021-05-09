const articlePATH = __dirname + "/../data/articles.json";
const accountsPATH = __dirname + "/../data/accounts.json";
var express = require('express');
var global = express.Router();
var user = require('./user.js');
var fs = require("fs");
const { stringify } = require('querystring');
const template = require('../lib/template_maker.js');
var articles = require(articlePATH);
var accounts = require(accountsPATH);
// The line above can be replaced with
// var AccountManager = require('../lib/account_manager.js');
// var accountManager = new AccountManager();
// to handle issues that is to do with user
// also I wrote a new class to handle articles: article_manager
// it would be more elegant to utilize the class 
// but maybe update later today

var d = new Date();
var month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
var today = month[d.getMonth()] + ' ' + String(d.getDate()) + ', ' + days[d.getDay()];

global.post('/insert', (req, res) => {
    // here may simply call addPostsToAuthor method of account_manager
    let newArticleId = articles.length;
    req.body["id"] = String(newArticleId);
    req.body["from"] = String(-1);
    req.body["date"] = today;

    articles.push(req.body);
    let str = JSON.stringify(articles, null, 4);
    res.send(str)
    fs.writeFile(articlePATH, str, (err) => {
        if (err) console.log(err);
    });
});

global.post('/addcomment',(req,res)=>{
    var postId = String(1);
    var TargetArticle;
    for(i in articles)
        if(articles[i].id == postId){
            TargetArticle = articles[i];
            break;
        }
    let newCommentId = TargetArticle.comments.length;
    //req.body["id"] = String(newCommentId);
    console.log(req);
}
);



global.post('/count', (req, res) => {
    res.send(articles.length);
});

global.get('/', (req, res) => {
    res.json(articles);
});

global.get('/user_post',(req,res)=>{
    // here may simply call getPostsByUser method of account_manager
    var User_id = String(-1);   //Here can be replaced with api returns current user's id
    var UserPost = [];
    for(var i = 0;i<articles.length;i++)
        if(articles[i].from === User_id)
            UserPost.push(articles[i]);
    //console.log(UserPost);
    res.json(UserPost);
    //TODO: Deal with some exception 
}
)


global.get('/followed_post',(req,res)=>{
    var User_id = String(0);   //Here can be replaced with api returns current user's id
    var F_User = [];
    var F_Post = [];
    var Total_Post = [];
    for(var i = 0;i<articles.length;i++)
        if(accounts[i].id === User_id){
            F_User=accounts[i].followees;
            F_Post=accounts[i].followedPosts;
            //console.log(F_User,F_Post,F_User[1]);
            break;
        }
    
    if(F_User.length)
    for(var i = 0;i<F_User.length;i++)
        for(var k in articles){
            if(articles[k].from==F_User[i])
                Total_Post.push(articles[k]);
            console.log(articles[k].from,F_User[i]);
            }

    if(F_Post.length)
    for(var j in F_Post)
        for(var k in articles)
            if(articles[k].id==F_Post[j])
                Total_Post.push(articles[k]);
    //TODO: Deal with some exception 
    res.json(Total_Post);
}
)




global.post('/post', (req, res) => {
    let newArticleId = articles.length + 1;
    let articleData = {
        "id": newArticleId,
        "from": shit,
        "body": req.body.article.body,
        "title": req.body.article.title,
        "date": function() { return 'date'; },


    };

});

module.exports = global;
