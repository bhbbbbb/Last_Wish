var express = require('express');
var finder = express.Router();
var AccountManager = require('../lib/account_manager.js');
var accountManager = new AccountManager();
var ArticleManager = require('../lib/article_manager.js');
var articleManager = new ArticleManager();

finder.get('/article', async (req, res) => {
    try {
        let searchingResult = await articleManager.searchArticleByKeywords(req.query.q);
        res.status(200).json(searchingResult);
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
        return;
    }
});

finder.get('/user', async (req, res) => {
    try {
        let searchingResult = await accountManager.searchUserByKeywords(req.query.q);
        res.status(200).json(searchingResult);
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
        return;
    }
});

finder.get('/tag', async (req, res) => {
    try {
        let searchingResult = await articleManager.searchArticleByTags(req.query.q);
        res.status(200).json(searchingResult);
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
        return;
    }
});

finder.get('/tag', async (req, res) => {

});

module.exports = finder;