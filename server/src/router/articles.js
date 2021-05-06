const articlePATH = __dirname + "/../data/articles.json";
var express = require('express');
var global = express.Router();
var fs = require("fs");
var articles = require(articlePATH);


global.post('/insert', (req, res) => {
    newArticleId = articles.length + 1;
    req.body["id"] = String(newArticleId);
    articles.push(req.body);
    let str = JSON.stringify(articles, null, 4);
    res.send(str)
    fs.writeFile(articlePATH, str, (err) => {
        if (err) console.log(err);
    });
})

global.post('/count', (req, res) => {
    res.send(articles.length);
});



global.get('/', (req, res) => {
    res.json(articles);
});

module.exports = global;
