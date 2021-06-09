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
]
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


global.post('/add_comment', (req, res) => {
    let newComent = articleManager.addCommentToArticle(req.body.author, req.body.article_id, req.body.comment);
    res.json(newComent);
});

global.get('/', (_req, res) => {
    articleManager
        .getAllArticles()
        .then((allArticles) => {
            res.status(200).json(allArticles);
        })
        .catch((error) => {
            console.log(error);
            res.status(400).json(error);
        })
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
        })
});

/**
 * @req req.query { username }
 */
global.get('/get_user_posts', user_session, (req, res) => {
    accountManager
        .getPostsByAuthor(req.session.user_id)
        .then((articleIds) => {
            res.status(200).json(articleIds);
        })
        .catch((error) => {
            console.log(error);
            res.status(400).json(error);
        });
});

global.get('/get_followed_posts', user_session, (req, res) => {
    accountManager
        .getFollowedPostsByUser(req.session.user_id)
        .then((articleIds) => {
            res.status(200).json(articleIds);
        })
        .catch((error) => {
            console.log(error);
            res.sendStatus(400);
            res.status(400).json(error);
        });
});

// the code below is not working for now
//============================================================================//

/**
 * @param {Number} req.body.article_id
 * @param {Object} req.body.newMilestone { title, body, time }
 */
global.post('/addMilestone', (req, res) => {
    var newMilestone;
    try {
        newMilestone = articleManager.addMilestoneToArticle(req.body.article_id, req.body.newMilestone);
    } catch (err) {
        console.log(err);
        res.sendStatus(400);
        return;
    }
    res.status(200).json(newMilestone);
    return;
})

global.post('/FollowedPostToggle', (req, res) => {
    try {
        accountManager.toggleFollowedPostsToUser(req.body.username, req.body.articleId);
    } catch (err) {
        console.log(err);
        res.sendStatus(400);
        return;
    }
    res.sendStatus(200);
    return;
})

global.post('/editArticle', (req, res) => {
    try {
        articleManager.replaceArticle(req.body.newArticle, req.body.articleId);
    } catch (err) {
        console.log(err);
        res.sendStatus(400);
        return;
    }
    res.sendStatus(200);
    return
})

// TODO:

// editComment
global.post('/editComment', (req, res) => {
    try {
        articleManager.replaceCommentOfArticle(req.body.newComment, req.body.articleId, req.body.commentId);
    } catch (err) {
        console.log(err);
        res.sendStatus(400);
        return;
    }
    res.sendStatus(200);
    return
})
// editMileStone

module.exports = global;