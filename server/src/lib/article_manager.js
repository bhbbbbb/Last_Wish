const Article = require('../models/Article');
const User = require("../models/User");
const Tag = require("../models/Tag");
var AccountManager = require("./account_manager")
var accountManager = new AccountManager();
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
        };
        const article = new Article(newArticleData);
        for (tagStr of articleContent.tags) {
            let existingTag = await Tag.findOne({ name: tagStr });
            if (existingTag) {
                existingTag.related.push(article._id);
                await existingTag.save();
            } else {
                let tag = new Tag({ name: tagStr });
                tag.related.push(article._id);
                await tag.save();
            }
            article.tags.push(tagStr);
        }
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
        return rawArticles.map(article => article._id);
    }

    this.rmArticleById = async function(articleId) {
        let deletedArticle = await Article.findByIdAndDelete(articleId);
        if (!deletedArticle)
            throw "no such article";
        for (tag of deletedArticle.tags) {
            Tag.findOneAndUpdate({ name: tag }, {
                $pullAll: {
                    related: [deletedArticle._id]
                }
            }).exec();
        }
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
        return rawArticles.map(article => article._id);
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
    
    this.searchArticlesByKeywords = async function(keywordStr) {
        // const updateFuzzy = require('./update_fuzzy');
        // await updateFuzzy(User, ['title', 'body']);
        let articles = await Article.fuzzySearch(keywordStr);
        return articles.map(article => article._id);
    }
    
    this.getRelatedArticlesByTag = async function(tagStr) {
        let tag = await Tag.findOne({ name: "#" + tagStr });
        if (tag)
            return tag.related;
        else
            return [];
    }
    
    this.searchTagsByKeywords = async function(keywordStr) {
        let tags = await Tag.fuzzySearch(keywordStr);
        return tags.map((tag) => {
            return {
                name: tag.name,
                nRef: tag.related.length
            };
        });
    }
    
    // to test:
    this.updateTags = async function() {
        let allArticles = await Article.find({});
        for (article of allArticles) {
            console.log(article.tags);
            for (tagStr of article.tags) {
                let existingTag = await Tag.findOne({ name: tagStr });
                if (existingTag) {
                    existingTag.related.push(article._id);
                    await existingTag.save();
                } else {
                    let tag = new Tag({ name: tagStr });
                    tag.related.push(article._id);
                    await tag.save();
                }
            }
        }
    }

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
        let score = 5;
        await accountManager.changeScore(article.author, score);
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
    // this.replaceArticle = async function(newArticle, articleId, userId) {
    //     let article = await Article.findById(articleId);
    //     if (!article)
    //         throw "no such article";
    //     if (userId != article.author)
    //         throw "not the author";
    //     if (newArticle.title)
    //         article.title = newArticle.title;
    //     if (newArticle.body)
    //         article.body = newArticle.body;
    //     article.date = Date.now();
    //     await article.save();
    //     return article.date;
    // }
    
    this.updateArticle = async function(articleId, updateQuery) {
        let article = await Article.findById(articleId);
        if (!article)
            throw "no such article";
        if (updateQuery.title)
            article.title = updateQuery.title;
        if (updateQuery.body)
            article.body = updateQuery.body;
        if (updateQuery.tags) {
            let toRemove = article.tags.filter(t => !updateQuery.tags.includes(t));
            let toAdd = updateQuery.tags.filter(t => !article.tags.includes(t));
            for (tag of toRemove) {
                Tag.findOneAndUpdate({ name: tag }, {
                    $pullAll: {
                        related: [article._id]
                    }
                }).exec();
                article.tags.pull(tag);
            }
            for (tagStr of toAdd) {
                let existingTag = await Tag.findOne({ name: tagStr });
                if (existingTag) {
                    existingTag.related.push(article._id);
                    await existingTag.save();
                } else {
                    let tag = new Tag({ name: tagStr });
                    tag.related.push(article._id);
                    await tag.save();
                }
                article.tags.push(tagStr);
            }
        }
        if (updateQuery.deleted_milestones) {
            for (deletedMilestoneId of updateQuery.deleted_milestones) {
                article.milestones.pull(deletedMilestoneId);
            }
        }
        if (updateQuery.new_milestones) {
            for (newMilestoneData of updateQuery.new_milestones) {
                article.milestones.push(newMilestoneData);
            }
        }
        if (updateQuery.modified_milestones) {
            for (modifiedMilestone of updateQuery.modified_milestones) {
                let milestone = await article.milestones.id(modifiedMilestone._id);
                if (!milestone)
                    throw "no such milestone";
                if (modifiedMilestone.title)
                    milestone.title = modifiedMilestone.title;
                if (modifiedMilestone.body)
                    milestone.body = modifiedMilestone.body;
                if (modifiedMilestone.estDate)
                    milestone.estDate = modifiedMilestone.estDate;
                if (modifiedMilestone.finished)
                    milestone.finished = modifiedMilestone.finished;
            }
        }
        await article.sortMilestonesAndSave();
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
        let score = set ? 100 : -100;
        await accountManager.changeScore(article.author, score);
        await article.save();
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


