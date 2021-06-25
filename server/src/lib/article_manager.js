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
        let allArticleIds = [];
        let rawArticles = await Article.find({});
        if (options) {
            if (options.new2old) {
                console.log('new2old');
                rawArticles.sort((a, b) => {
                    return b.date - a.date;
                });
            } else {
                console.log('old2new');
                rawArticles.sort((a, b) => {
                    return a.date - b.date;
                });
            }
            if (options.finished) {
                rawArticles.sort((a, b) => {
                    return a.finished - b.finished;
                });
            }
        }
        for (article of rawArticles) {
            allArticleIds.push(article._id);
        }
        return allArticleIds;
    }

    this.rmArticleById = async function(articleId) {
        let deletedArticle = await Article.findByIdAndDelete(articleId);
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
        } else {
            throw "no such article";
        }
    }

    this.sortArticleIdsByOptions = async function(articleIds, options) {
        let articles = await Article.find({ '_id': { $in: articleIds } });
        if (options) {
            if (options.new2old) {
                console.log('new2old');
                articles.sort((a, b) => {
                    return b.date - a.date;
                });
            } else {
                console.log('old2new');
                articles.sort((a, b) => {
                    return a.date - b.date;
                });
            }
            if (options.finished) {
                articles.sort((a, b) => {
                    return a.finished - b.finished;
                });
            }
        }
        let sortedArticleIds = [];
        for (article of articles) {
            sortedArticleIds.push(article._id);
        }
        console.log(sortedArticleIds);
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
        if (article) {
            return article;
        } else {
            throw "no such article";
        }
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
        if (article) {
            return article.toFrontendFormat();
        } else 
        throw "no such article";
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
        await article.comments.push(newComment);
        let len = article.comments.length;
        let res = await article.save();
        return res.comments[len - 1].date;
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
        console.log(articleId);
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
        let result = await Article.findById(articleId);
        if (result) {
            let comment = await result.comments.id(commentId);
            if (comment) {
                if (comment.author != userId) {
                    throw "not the author";
                }
                comment.body = newComment;
                comment.date = Date.now();
                await result.save();
                return comment.date;
            }
            throw "no such comment";
        }
        throw "no such article";
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

    this.addMilestoneToArticle = async function(articleId, milestone) {
        let article = await Article.findById(articleId);
        if (article) {
            article.milestones.push(milestone);
            await article.sortMilestonesAndSave();
        } else {
            throw "no such artcle";
        }
    }
    
    this.replaceMilestoneOfArticle = async function(newMilestone, articleId, milestoneId) {
        let article = await Article.findById(articleId);
        if (article) {
            let milestone = article.milestones.id(milestoneId);
            if (milestone) {
                milestone.title = newMilestone.title;
                milestone.body = newMilestone.body;
                milestone.estDate = newMilestone.estDate;
                milestone.finished = newMilestone.finished;
                await article.sortMilestonesAndSave();
            } else {
                throw "no such milestone"
            }
        } else {
            throw "no such aritcle";
        }
    }
    
    this.toggleFinishedMilestoneOfArticle = async function(articleId, milestoneId) {
        let article = await Article.findById(articleId);
        if (article) {
            let milestone = article.milestones.id(milestoneId);
            if (milestone) {
                milestone.finished = !milestone.finished;
                await article.sortMilestonesAndSave();
            } else {
                throw "no such milestone"
            }
        } else {
            throw "no such aritcle";
        }
    }
}