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


global.post('/add_comment', async(req, res) => {
    let author = req.body.author;
    let articleId = req.body.article_id;
    let comment = req.body.comment;
    let newDate = await articleManager.addCommentToArticle(author , articleId, comment);
    res.status(200).json(newDate);
    console.log(newDate);
});

global.post('/edit_comment',async(req,res)=>{
    let newComment = req.body.new_comment;
    let articleId = req.body.article_id;
    let commentId = req.body.comment_id;
    let userId = req.body.user_id;
    try{
    let newDate = await articleManager.replaceCommentOfArticle(newComment , articleId, commentId, userId);
    res.status(200).json(newDate);
    }catch(e){
        console.log(e);
        res.status(400).json();
    }
});


global.get('/', (req, res) => {
    articleManager
        .getAllArticleIds(req.query.options)
        .then((allArticleIds) => {
            res.status(200).json(allArticleIds);
        })
        .catch((error) => {
            console.log(error);
            res.status(400).json(error);
        })
});
global.get('/get_liked_posts', async(req, res)=>{
    try{
        const result = await accountManager.getUserLiked(req.query.id);
        console.log(result);
        if(result)
            res.status(200).json(result);
        else
            res.status(400).json();
    }catch(e){
        res.status(500).json();
    }
})
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
 * @req req.query { user_id }
 */
global.get('/get_user_posts', user_session, (req, res) => {
    accountManager
        .getPostsByAuthor(req.query.user_id)
        .then((articleIds) => {
            articleManager
                .sortArticleIdsByOptions(articleIds, req.query.options)
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
 * @req req.query { user_id }
 */
global.get('/get_followed_posts', user_session, (req, res) => {
    accountManager
        .getFollowedPostsByUser(req.session.user_id)
        .then((articleIds) => {
            articleManager
                .sortArticleIdsByOptions(articleIds, req.query.options)
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