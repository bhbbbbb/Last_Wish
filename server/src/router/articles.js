const articlePATH = __dirname + "/../data/articles.json";
var express = require('express');
var global = express.Router();
var fs = require("fs");
var articles = require(articlePATH);


global.post('/insert', (req, res) => {
    articles.push(req.body);
    let str = JSON.stringify(articles);
    res.send(str)
    fs.writeFile(articlePATH, str, (err) => {
        if (err) console.log(err);
    });
})



global.get('/', (req, res) => {
    res.json(articles);
});

module.exports = global;
