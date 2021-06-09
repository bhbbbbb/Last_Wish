const fs = require("fs");
var d = new Date();
var month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
var today = `${month[d.getMonth()]}/${String(d.getDate())} ${days[d.getDay()]}`;
const Article = require('../models/Article');
const User = require("../models/User");

module.exports = function() {
    // this.articlePATH = __dirname + "/../data/articles.json";
    // this.articles = require(this.articlePATH);

    /**
     * @param {String} articleId 
     * @returns if there is an article with such id
     */
    this.hasArticle = async function(articleId) {
        try {
            return await Article.fineOne({ _id: articleId})
                                .exec()
                                .then((article) => {
                                    return article != null;
                                });
        } catch (error) {
            throw "db access failed";
        }
        /*
        console.log(`has: ${articleId}`);
        console.log(Number(articleId));
        console.log(this.articles.length);
        return Number(articleId) <= this.articles.length;
        */
    }

    this.hasCommentInArticle = function(commentId, articleId) {
        return Number(commentId) <= this.articles[Number(articleId)].comments.length
    }

    /**
     * @param {Object} author the account info of the author
     * @param {Object} articleContent = {body, title, [tags], [milestones]}
     * @returns {String} the new article id
     */
    this.addArticle = function(author, articleContent) {
        try {
            let newArticleData = {
                title: articleContent.title,
                body: articleContent.body,
                author: author._id,
                tags: articleContent.tags,
            };
            const article = new Article(newArticleData);
            for (newMilestoneData of articleContent.milestones) {
                article.milestones.push(newMilestoneData);
            }
            article.sortMilestonesAndSave();
            return article._id;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    /**
     * @returns the json object containing all articles with frontend format
     */
    this.getAllArticles = async function() {
        try {
            let allArticles = [];
            let rawArticles = await Article.find({})
                                           .populate('author')
                                           .then((allArticles) => {
                                               return allArticles;
                                           });
            for (article of rawArticles) {
                allArticles.push(article.toFrontendFormat());
            }
            // add sorting mechanism
            return allArticles;
        } catch (error) {
            throw "db access failed";
        }
    }
    
    this.rmArticleById = async function(articleId) {
        try {
            let deletedArticle = await Article.findByIdAndDelete(articleId)
                         .exec()
                         .then((deletedArticle) => {
                             return deletedArticle;
                         });
            if (deletedArticle) {
                for (fan of deletedArticle.fans) {
                    console.log(fan);
                    User.findByIdAndUpdate(fan, {
                        $pullAll: {
                            followedPosts: [deletedArticle._id]
                        }
                    }).exec();
                }
                User.findByIdAndUpdate(deletedArticle.author, {
                    $pullAll: {
                        selfPosts: [deletedArticle._id]
                    }
                }).exec();
                return deletedArticle
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
        throw "no such article";
    }
    
    /**
     * 
     * @param {String} articleId 
     * @returns the article with given article id
     * @trhows "no such article" exception
     */
    this.getArticleById = async function(articleId) {
        try {
            let article = Article.findById(articleId)
                                 .populate('author')
                                 .exec()
                                 .then((article) => {
                                     return article;
                                 });
            if (article) {
                return article;
            }
        } catch (error) {
            console.log(error);
            throw "db access failed";
            
        }
        throw "no such article";
    }
    
    this.getMultipleArticlesById = async function(articleIds, options) {
        let articles = [];
        for (articleId of articleIds) {
            this.getFormatedArticleById(articleId)
                .then((article) => {
                    articles.push(article);
                });
        }
        return articles;
    }

    /**
     * 
     * @param {String} articleId 
     * @returns the article with given article id
     * @trhows "no such article" exception
     */
    this.getFormatedArticleById = async function(articleId) {
        try {
            let article = Article.findById(articleId)
                                 .populate('author')
                                 .exec()
                                 .then((article) => {
                                     return article.toFrontendFormat();
                                 });
            if (article) {
                return article;
            }
        } catch (error) {
            console.log(error);
            throw "db access failed";
            
        }
        throw "no such article";
    }

    /**
     * @param {Object} author 
     * @param {String} articleId 
     * @param {String} commentStr 
     * @throws "no such article" exception
     * @returns {Object} newComment
     */
    this.addCommentToArticle = function(author, articleId, commentStr) {
        if (!this.hasArticle(articleId)) {
            throw "no such article";
        }
        let article = this.articles[Number(articleId)];
        let newCommentId = String(article.comments.length);
        let newCommentData = {
            "id": newCommentId,
            "date": today,
            "body": commentStr,
            "from": author.id
        }
        let newNewComment = newComment(newCommentData);
        article.comments.push(newNewComment);
        synchronize(this.articles, this.articlePATH);
        return newNewComment;
    }

    /**
     * Replace the body and title of an article
     * 
     * @param {Object} newComment 
     * @param {String} articleId 
     * @param {String} commentId 
     * 
     * @throws "no such article" exception
     */
    this.replaceArticle = function(newArticle, articleId) {
        if (!this.hasArticle(articleId)) {
            throw "no such article";
        } this.articles[Number(articleId)].title = newArticle.title;
        this.articles[Number(articleId)].body = newArticle.body;
        synchronize(this.articles, this.articlePATH);
    }

    /**
     * Replace a comment body in an article
     * 
     * @param {Object} newComment 
     * @param {String} articleId 
     * @param {String} commentId 
     * 
     * @throws "no such article" exception
     */
    this.replaceCommentOfArticle = function(newComment, articleId, commentId) {
        if (!this.hasArticle(articleId)) {
            throw "no such article";
        }
        if (!this.hasCommentInArticle(commentId, articleId)) {
            throw "no such comment"
        }
        this.articles[Number(articleId)].comment[Number(commentId)].body = newComment;
        synchronize(this.articles, this.articlePATH);
    }

    /**
     * Now the milestone has no id
     * However we need to add an id
     * later for better management
     * such as editing milestone or
     * editing the article contaned in
     * each milestone
     */
    this.addMilestoneToArticle = function(articleId, milestone) {
        if (!this.hasArticle(articleId)) {
            throw "no such article";
        }
        let article = this.articles[Number(articleId)];
        let newMilestoneId = String(article.wishes.length);
        let newMilestone = {
            title: milestone.title,
            body: milestone.body,
            time: milestone.time,
            id: newMilestoneId,
        };
        article.wishes.push(newMilestone);
        synchronize(this.articles, this.articlePATH);
        return newMilestone;
    }

    /**
     * 
     * @param {Number} choose 
     * @returns choose = 1 : Month
     * @returns choose = 2 : Month/Date
     * @returns choose else : Month/Date Day
     */
    this.getToday = function(choose){
        if (choose === 1)
            return today.split('/')[0];             //return Month
        else if (choose === 2)
            return today.split(' ')[0];             //return Month/Date
        else
            return today;                           //return Month/Date Day
    }
}

function newArticle(newArticleData) {
    let template = {
        "id": "",
        "from": "",
        "body": "",
        "title": "",
        "date": "",
        "wishes": [],
        "comments": []
    };
    for (keys in newArticleData) {
        template[keys] = newArticleData[keys];
    }
    return template;
}

function newComment(newCommentData) {
    let template = {
        "id": "",
        "date": "",
        "body": "",
        "from": ""
    };
    for (keys in newCommentData) {
        template[keys] = newCommentData[keys];
    }
    return template;
}

function newMilestone(newMilestoneData) {
    let template = {
        "id": "",
        "estDate": "",
        "finishDate": "",
        "isDoen": false
    };
    for (keys in newCommentData) {
        template[keys] = newMilestoneData[keys];
    }
    return template;
}

function synchronize(obj, path) {
    let data = JSON.stringify(obj, null, 4);
    fs.writeFile(path, data, (err) => {
        if (err) console.log(err);
    });
}