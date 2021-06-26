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
global.post('/insert', user_session, async (req, res) => {
    try {
        let newPostId = await accountManager.addPostsToAuthor(req.session.user_id, req.body.article_content);
        res.status(200).json(newPostId);
        return;
    } catch (error) {
        console.log(error);
        let response = INSERT[USER_NOT_FOUND];
        res.status(response.status).json(response.body);
        return;
    }
});

global.post('/delete', user_session, async (req, res) => {
    try {
        let posts = await accountManager.getPostsByAuthor(req.session.user_id);
        if (posts.includes(req.body.article_id)) {
            await articleManager.rmArticleById(req.body.article_id);
            res.sendStatus(200);
            return;
        } else {
            res.status(400).json("not the author");
            return;
        }
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
        return;
    }
});


global.post('/add_comment', user_session, async (req, res) => {
    try {
        let author = req.session.user_id;
        let articleId = req.body.article_id;
        let comment = req.body.comment;
        let newDate = await articleManager.addCommentToArticle(author , articleId, comment);
        res.status(200).json(newDate);
        return;
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
        return;
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
        return;
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
        return;
    }
});

// global.post('/add_milestone', user_session, async (req, res) => {
//     try {
//         let posts = await accountManager.getPostsByAuthor(req.session.user_id);
//         if (posts.includes(req.body.article_id)) {
//             await articleManager.addMilestoneToArticle(req.body.article_id, req.body.milestone);
//             res.sendStatus(200);
//             return;
//         } else {
//             res.status(400).json("not the author");
//             return;
//         }
//     } catch (error) {
//         console.log(error);
//         res.status(400).json(error);
//         return;
//     }
// });

// global.post('/edit_milestone', user_session, async (req, res) => {
//     try {
//         let posts = await accountManager.getPostsByAuthor(req.session.user_id);
//         if (posts.includes(req.body.article_id)) {
//             await articleManager.replaceMilestoneOfArticle(
//                 req.body.new_milestone,
//                 req.body.article_id,
//                 req.body.milestone_id
//             );
//             res.sendStatus(200);
//             return;
//         } else {
//             res.status(400).json("not the author");
//             return;
//         }
//     } catch (error) {
//         console.log(error);
//         res.status(400).json(error);
//         return;
//     }
// });

global.post('/set_finished_milestone', user_session, async (req, res) => {
    try {
        let set = req.body.set == "true";
        let posts = await accountManager.getPostsByAuthor(req.session.user_id);
        if (posts.includes(req.body.article_id)) {
            await articleManager.setFinishedMilestoneOfArticle(
                req.body.article_id,
                req.body.milestone_id,
                set
            );
            res.sendStatus(200);
            return;
        } else {
            res.status(400).json("not the author");
            return;
        }
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
        return;
    }
});

global.get('/', async (req, res) => {
    let options = {
        sortBy: req.query.sort_by,
        filter: req.query.filter
    };
    try {
        let allArticleIds = await articleManager.getAllArticleIds(options);
        res.status(200).json(allArticleIds);
        return;
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
        return;
    }
});

global.get('/get_article_by_id', async (req, res) => {
    try {
        let article = await articleManager.getFormatedArticleById(req.query.article_id);
        res.status(200).json(article);
        return;
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
        return;
    }
});

/**
 * @req req.query { user_id }
 */
global.get('/get_user_posts', user_session, async (req, res) => {
    let options = {
        sortBy: req.query.sort_by,
        filter: req.query.filter
    };
    try {
        let articleIds = await accountManager.getPostsByAuthor(req.query.user_id);
        let sortedArticleIds = await articleManager.sortArticleIdsByOptions(articleIds, options);
        res.status(200).json(sortedArticleIds);
        return;
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
        return;
    }
});

/**
 * @param article_id
 */
 global.post('/edit_article', user_session, async (req, res) => {
    try {
        // let newArticle = {
        //     "title": req.body.newArticle.title,
        //     "body": req.body.newArticle.body,
        // };
        let newArticle = req.body.new_article;
        let articleId = req.body.article_id;
        let userId = req.session.user_id;
        let newDate = await articleManager.replaceArticle(newArticle, articleId, userId);
        res.status(200).json(newDate);
        return;
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
        return;
    }
});

global.get('/get_followed_posts', user_session, async (req, res) => {
    let options = {
        sortBy: req.query.sort_by,
        filter: req.query.filter
    };
    // accountManager
    //     .getFollowedPostsByUser(req.session.user_id)
    //     .then((articleIds) => {
    //         articleManager
    //             .sortArticleIdsByOptions(articleIds, options)
    //             .then((sortedArticleIds) => {
    //                 res.status(200).json(sortedArticleIds);
    //             });
    //     })
    //     .catch((error) => {
    //         console.log(error);
    //         res.sendStatus(400);
    //         res.status(400).json(error);
    //     });
    try {
        let articleIds = await accountManager.getFollowedPostsByUser(req.session.user_id);
        let sortedArticleIds = await articleManager.sortArticleIdsByOptions(articleIds, options);
        res.status(200).json(sortedArticleIds);
        return;
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
        return;
    }
});

global.get('/visit', async (req, res) => {
    articleId = req.query.article_id;
    try {
        await articleManager.addVisited(articleId);
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
        return;
    }
    res.status(200).json();
    return;
})

module.exports = global;