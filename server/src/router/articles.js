const articlePATH = __dirname + "/../data/articles.json";
var express = require('express');
var global = express.Router();
var fs = require("fs");
const template = require('../lib/template_maker.js');
var articles = require(articlePATH);

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
    let newArticleId = articles.length + 1;
    req.body["id"] = String(newArticleId);
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

global.get('/', (req, res) => {
    res.json(articles);
});

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
