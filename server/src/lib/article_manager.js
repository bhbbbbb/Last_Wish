const Article = require('../models/Article');
const User = require("../models/User");

module.exports = function() {

    /**
     * @param {String} articleId 
     * @returns if there is an article with such id
     */
    this.hasArticle = async function(articleId) {
        return await Article.fineOne({ _id: articleId}) != null;
    }

    /**
     * @param {Object} author the account info of the author
     * @param {Object} articleContent = {body, title, [tags], [milestones]}
     * @returns {String} the new article id
     */
    this.addArticle = async function(author, articleContent) {
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
        await article.sortMilestonesAndSave();
        return article._id;
    }

    /**
     * @returns the json object containing all articles with frontend format
     */
    this.getAllArticleIds = async function(options) {
        let rawArticles = [];
        if (options) {
            switch (options.filter) {
                case "all":
                    rawArticles = await Article.find({});
                    break;
                case "finished":
                    rawArticles = await Article.find({ finished: true });
                    break;
                case "unfinished":
                    rawArticles = await Article.find({ finished: false});
                    break;
                default:
                    rawArticles = await Article.find({});
                    break;
            }
            switch (options.sortBy) {
                case "new2old":
                    rawArticles.sort((a, b) => {
                        return b.date - a.date;
                    });
                    break;
                case "old2new":
                    rawArticles.sort((a, b) => {
                        return a.date - b.date;
                    });
                    break;
                case "most_liked":
                    rawArticles.sort((a, b) => {
                        return b.likes - a.likes;
                    });
                    break;
                case "most_followed":
                    rawArticles.sort((a, b) => {
                        return b.fans.length - a.fans.length;
                    });
                    break;
            }
            
        }
        let allArticleIds = [];
        for (article of rawArticles) {
            allArticleIds.push(article._id);
        }
        return allArticleIds;
    }

    this.rmArticleById = async function(articleId) {
        let deletedArticle = await Article.findByIdAndDelete(articleId);
        if (!deletedArticle)
            throw "no such article";
        for (fan of deletedArticle.fans) {
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

    this.sortArticleIdsByOptions = async function(articleIds, options) {
        let rawArticles = [];
        if (options) {
            switch (options.filter) {
                case "all":
                    rawArticles = await Article.find({ '_id': { $in: articleIds } });
                    break;
                case "finished":
                    rawArticles = await Article.find({ '_id': { $in: articleIds }, finished: true });
                    break;
                case "unfinished":
                    rawArticles = await Article.find({ '_id': { $in: articleIds }, finished: false });
                    break;
                default:
                    rawArticles = await Article.find({ '_id': { $in: articleIds } });
                    break;
            }
            switch (options.sortBy) {
                case "new2old":
                    rawArticles.sort((a, b) => {
                        return b.date - a.date;
                    });
                    break;
                case "old2new":
                    rawArticles.sort((a, b) => {
                        return a.date - b.date;
                    });
                    break;
                case "most_liked":
                    rawArticles.sort((a, b) => {
                        return b.likes - a.likes;
                    });
                    break;
                case "most_followed":
                    rawArticles.sort((a, b) => {
                        return b.fans.length - a.fans.length;
                    });
                    break;
            }
        }
        let sortedArticleIds = [];
        for (article of rawArticles) {
            sortedArticleIds.push(article._id);
        }
        return sortedArticleIds;
    }
    
    /**
     * 
     * @param {String} articleId 
     * @returns the article with given article id
     * @trhows "no such article" exception
     */
    this.getArticleById = async function(articleId) {
        let article = await Article.findById(articleId)
                                   .populate('author')
        if (!article)
            throw "no such article";
        return article;
    }
    
    /**
     * 
     * @param {String} articleId 
     * @returns the article with given article id
     * @trhows "no such article" exception
     */
    this.getFormatedArticleById = async function(articleId) {
        let article = await Article.findById(articleId)
                                   .populate('author');
        if (!article)
            throw "no such article";
        return article.toFrontendFormat();
    }

    // TODO: modify this
    /**
     * @param {Object} author 
     * @param {String} articleId 
     * @param {String} commentStr 
     * @throws "no such article" exception
     * @throws "author is required" exception
     * @returns date of newComment
     */
     this.addCommentToArticle = async function(author, articleId, commentStr) {
        let article = await Article.findById(articleId);
        if (!article)
            throw "no such article";
        if (!author)
            throw "author is required";
            
        let newComment = {
            "author": author,
            "body": commentStr,
        };
        let len = await article.comments.push(newComment);
        await article.save();
        return article.comments[len - 1].date;
     }

    /**
    * Replace the body and title of an article
    * 
    * @param {Object} newArticle 
    * @param {String} articleId 
    * @param {String} userId`
    * @throws "no such article" exception
    * @throws "not the author" exception
    */
    this.replaceArticle = async function(newArticle, articleId, userId) {
        let article = await Article.findById(articleId);
        if (!article)
            throw "no such article";
        if (userId != article.author)
            throw "not the author";
        if (newArticle.title)
            article.title = newArticle.title;
        if (newArticle.body)
            article.body = newArticle.body;
        article.date = Date.now();
        await article.save();
        return article.date;
    }
    
    this.updateArticle = async function(articleId, updateQuery) {
        let article = await Article.findById(articleId);
        if (!article)
            throw "no such article";
        if (updateQuery.title)
            article.title = updateQuery.title;
        if (updateQuery.body)
            article.body = updateQuery.body;
        if (updateQuery.tags)
            article.tags = updateQuery.tags;
        if (updateQuery.title)
            article.title = updateQuery.title;
        for (milestoneData of updateQuery.milestones) {
            if (milestoneData._id) {
                oldMilestone.body = milestoneData.body;
                oldMilestone.title = milestoneData.title;
                oldMilestone.estDate = milestoneData.estDate;
                oldMilestone.finished = milestoneData.finished;
            } else {
                article.milestones.push(milestoneData);
            }
        }
        for (milestone of article.milestones) {
            // if (milestone._id)
        }
        await article.save();
        return article.date;
    }

    /**
     * Replace a comment body in an article
     * @param {Object} newComment 
     * @param {String} articleId 
     * @param {String} commentId 
     * @param {String} userId 
     * @throws "no such article" exception
     * @throws "not the author" exception
     * @throws "no such comment" exception
     * @returns last edit date of comment
     */
    this.replaceCommentOfArticle = async function(newComment, articleId, commentId, userId) {
        let article = await Article.findById(articleId);
        if (!article)
            throw "no such article";
        let comment = await article.comments.id(commentId);
        if (!comment)
            throw "no such comment";
        if (comment.author != userId)
            throw "not the author";
        comment.body = newComment;
        comment.date = Date.now();
        await article.save();
        return comment.date;
    }

    /**
     * @parma articleId
     * @throw "no such article"
     */
    this.addVisited = async function(articleId){
        let article = await Article.findById(articleId);
        if (!article)
            throw "no such article"
        article.visited++;
        await article.save();
        return;
    }
    
    this.setFinishedArticle = async function(articleId, set) {
        let article = await Article.findById(articleId);
        if (!article)
            throw "no such article";
        article.finished = set;
        await article.save();
    }

    this.addMilestoneToArticle = async function(articleId, milestone) {
        let article = await Article.findById(articleId);
        if (!article)
            throw "no such artcle";
        article.milestones.push(milestone);
        await article.sortMilestonesAndSave();
    }
    
    this.replaceMilestoneOfArticle = async function(newMilestone, articleId, milestoneId) {
        let article = await Article.findById(articleId);
        if (!article)
            throw "no such aritcle";
        let milestone = article.milestones.id(milestoneId);
        if (!milestone)
            throw "no such milestone"
        milestone.title = newMilestone.title;
        milestone.body = newMilestone.body;
        milestone.estDate = newMilestone.estDate;
        milestone.finished = newMilestone.finished;
        await article.sortMilestonesAndSave();
    }
    
    this.setFinishedMilestoneOfArticle = async function(articleId, milestoneId, set) {
        let article = await Article.findById(articleId);
        if (!article)
            throw "no such aritcle";
        let milestone = article.milestones.id(milestoneId);
        if (!milestone)
            throw "no such milestone"
        milestone.finished = set;
        await article.sortMilestonesAndSave();
    }
}