var express = require('express');
var finder = express.Router();
var AccountManager = require('../lib/account_manager.js');
var accountManager = new AccountManager();
var ArticleManager = require('../lib/article_manager.js');
var articleManager = new ArticleManager();

finder.get('/articles', async (req, res) => {
    try {
        let searchingResult = await articleManager.searchArticlesByKeywords(req.query.q);
        res.status(200).json(searchingResult);
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
        return;
    }
});

finder.get('/users', async (req, res) => {
    try {
        let searchingResult = await accountManager.searchUsersByKeywords(req.query.q);
        res.status(200).json(searchingResult);
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
        return;
    }
});

finder.get('/tags', async (req, res) => {
    try {
        let searchingResult = await articleManager.getRelatedArticlesByTag(req.query.q);
        res.status(200).json(searchingResult);
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
        return;
    }
});

finder.get('/tag_names', async (req, res) => {
    try {
        let searchingResult = await articleManager.searchTagsByKeywords(req.query.q);
        res.status(200).json(searchingResult);
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
        return;
    }
});

finder.get('/', async (req, res) => {
    try {
        let searchingResult = {
            "users": await accountManager.searchUsersByKeywords(req.query.q),
            "articles": await articleManager.searchArticlesByKeywords(req.query.q),
            "tags": await articleManager.searchTagsByKeywords(req.query.q)
        };
        res.status(200).json(searchingResult);
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
        return;
    }
});

module.exports = finder;