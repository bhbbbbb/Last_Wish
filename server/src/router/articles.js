const articlePATH = __dirname + "/../data/articles.json";
var express = require('express');
var router = express.Router();
var fs = require("fs");
var articles = require(articlePATH);


router.post('/insert', (req, res) => {
    articles.push(req.body);
    let str = JSON.stringify(articles);
    res.send(str)
    fs.writeFile(articlePATH, str, (err) => {
        if (err) console.log(err);
    });
})



router.get('/', (req, res) => {
    res.json(articles);
});

module.exports = router;
