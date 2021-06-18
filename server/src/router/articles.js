var express = require('express');
var global = express.Router();
var user_session = require('../lib/session.js');
var AccountManager = require('../lib/account_manager.js');
var accountManager = new AccountManager();
var ArticleManager = require('../lib/article_manager.js');
var articleManager = new ArticleManager();

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
];
global.post('/insert', user_session, (req, res) => {
    accountManager
        .addPostsToAuthor(req.session.user_id, req.body.article_content)
        .then((newPostId) => {
            let response = INSERT[SUCCEED];
            res.status(response.status).json(newPostId);
        })
        .catch((error) => {
            console.log(error);
            let response = INSERT[USER_NOT_FOUND];
            res.status(response.status).json(response.body);
        })
});

global.post('/delete', user_session, (req, res) => {
    articleManager
        .rmArticleById(req.body.article_id)
        .then(() => {
            res.sendStatus(200);
        })
        .catch((error) => {
            console.log(error);
            res.status(400).json(error);
        });
});


global.post('/add_comment', user_session, async (req, res) => {
    try {
        let author = req.session.user_id;
        let articleId = req.body.article_id;
        let comment = req.body.comment;
        let newDate = await articleManager.addCommentToArticle(author , articleId, comment);
        res.status(200).json(newDate);
        console.log(newDate);
    } catch (error) {
        console.log(error);
        res.status(400).json;
    }
});

global.post('/edit_comment', user_session, async (req, res) => {
    let newComment = req.body.new_comment;
    let articleId = req.body.article_id;
    let commentId = req.body.comment_id;
    let userId = req.session.user_id;
    try {
        let newDate = await articleManager.replaceCommentOfArticle(newComment , articleId, commentId, userId);
        res.status(200).json(newDate);
    } catch (e) {
        console.log(e);
        res.status(400).json();
    }
});


global.get('/', (req, res) => {
    let options = {
        new2old: req.query.new2old === 'true',
        finished: req.query.finished === 'true'
    };
    articleManager
        .getAllArticleIds(options)
        .then((allArticleIds) => {
            res.status(200).json(allArticleIds);
        })
        .catch((error) => {
            console.log(error);
            res.status(400).json(error);
        });
});

global.get('/get_article_by_id', (req, res) => {
    articleManager
        .getFormatedArticleById(req.query.article_id)
        .then((article) => {
            res.status(200)
               .json(article);
        })
        .catch((error) => {
            console.log(error);
            res.status(400).json(error);
        });
});

/**
 * @req req.query { user_id }
 */
global.get('/get_user_posts', user_session, (req, res) => {
    let options = {
        new2old: req.query.new2old === 'true',
        finished: req.query.finished === 'true'
    };
    accountManager
        .getPostsByAuthor(req.query.user_id)
        .then((articleIds) => {
            articleManager
                .sortArticleIdsByOptions(articleIds, options)
                .then((sortedArticleIds) => {
                    res.status(200).json(sortedArticleIds);
                });
        })
        .catch((error) => {
            console.log(error);
            res.status(400).json(error);
        });
});

/**
 * @param article_id
 */
 global.post('/edit_article', user_session, async (req, res) => {
    try {
        let newArticle = {
            "title": req.body.newArticle.title,
            "body": req.body.newArticle.body,
        };
        let articleId = req.body.article_id;
        let userId = req.session.user_id;
        let newDate = await articleManager.replaceArticle(newArticle, articleId, userId);
        res.status(200).json(newDate);
    } catch (err) {
        console.log(err);
        res.sendStatus(400);
        return;
    }
});

global.get('/get_followed_posts', user_session, (req, res) => {
    let options = {
        new2old: req.query.new2old == 'true',
        finished: req.query.finished == 'true'
    };
    accountManager
        .getFollowedPostsByUser(req.session.user_id)
        .then((articleIds) => {
            articleManager
                .sortArticleIdsByOptions(articleIds, options)
                .then((sortedArticleIds) => {
                    res.status(200).json(sortedArticleIds);
                });
        })
        .catch((error) => {
            console.log(error);
            res.sendStatus(400);
            res.status(400).json(error);
        });
});

global.get('/visit',async(req, res) => {
    articleId = req.query.article_id;
    try {
        await articleManager.addVisited(articleId);
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
    res.status(200).json();
})

module.exports = global;