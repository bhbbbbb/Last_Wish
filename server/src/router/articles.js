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

var d = new Date();
var month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
var today = month[d.getMonth()] + ' ' + String(d.getDate()) + ', ' + days[d.getDay()];

var article_template = {
    "id": function() { return 'id'; },
    "from": function() { return 'from'; },
    "body": function() { return 'body'; },
    "title": function() { return 'title'; },
    "date": function() { return 'date'; },
    "wishes": [],
    "comments": []
};

var comment_template = {
    "id": function() { return 'id'; },
    "date": function() { return 'date'; },
    "body": function() { return 'body'; },
    "from": function() { return 'from'; }
}

let newArticle = template.templateMaker(article_template);
let newComment = template.templateMaker(comment_template);


global.post('/insert', (req, res) => {
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

global.post('/count', (req, res) => {
    res.send(articles.length);
});

global.get('/id', (req, res) => {
    res.send(user.getUserId(req.query.id));
});

global.get('/', (req, res) => {
    res.json(articles);
});

global.get('/user_post',(req,res)=>{
    var User_id = String(-1);   //Here can be replaced with api returns current user's id
    var UserPost = [];
    for(var i = 0;i<articles.length;i++)
        if(articles[i].from === User_id)
            UserPost.push(articles[i]);
    //console.log(UserPost);
    res.json(UserPost);
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
    console.log(F_User,F_User[0],F_User[1]);
    console.log(F_Post);
    console.log(Total_Post);
    
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
