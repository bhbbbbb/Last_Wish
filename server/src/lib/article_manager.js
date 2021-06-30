const Article = require('../models/Article'); const User = require("../models/User");
const Tag = require("../models/Tag");
const NotifyManager = require('./notify_manager');
var notifyManager = new NotifyManager();
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
    this.addArticle = async function(author, articleContent, citationId) {
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
        if (citationId) {
            // We know this post is citing another
            let citation = await Article.findById(citationId)
            .populate('author');
            if (!citation)
            throw "citation not found";
            article.citation = citationId;
            citation.citedCount++;
            citation.author.citedCount++;
            citation.author.changeScore(10);
            citation.author.save();
            citation.save();
            await notifyManager.createNotify(author._id, citation.author._id, article._id, 'Quote');
        }
        await article.sortMilestonesAndSave();
        let tagUsers = await this.tagTextParse(articleContent.body);
        for (tagUser of tagUsers) {
            if (tagUser != author._id)
                await notifyManager.createNotify(author._id, tagUser, article._id, 'TagInPost');
        }
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
    
    this.searchArticlesByKeywords = async function(keywordStr, options) {
        // const updateFuzzy = require('./update_fuzzy');
        // await updateFuzzy(User, ['title', 'body']);
        let rawArticles = [];
        if (options) {
            switch (options.filter) {
                case "all":
                    rawArticles = await Article.find({})
                                               .fuzzySearch(keywordStr);
                    break;
                case "finished":
                    rawArticles = await Article.find({ finished: true })
                                               .fuzzySearch(keywordStr);
                    break;
                case "unfinished":
                    rawArticles = await Article.find({ finished: false})
                                               .fuzzySearch(keywordStr);
                    break;
                default:
                    rawArticles = await Article.find({})
                                               .fuzzySearch(keywordStr);
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
                case "default":
                    break;
            }
        }
        return rawArticles.map(article => article._id);
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
        let article = await Article.findById(articleId)
                                   .populate('author');
        if (!article)
            throw "no such article";
        if (!author)
            throw "author is required";
        let newComment = {
            "author": author,
            "body": commentStr,
        };
        let len = await article.comments.push(newComment);
        let score = 5;
        article.author.changeScore(score);
        await article.author.save();
        await article.save();
        await notifyManager.createNotify(author, article.author._id, articleId, 'CommentOnSelf');
        let tagUsers = await this.tagTextParse(commentStr);
        for (tagUser of tagUsers) {
            if (tagUser != article.author._id)
                await notifyManager.createNotify(author, tagUser, article._id, 'TagInComment');
        }
        for (fan of article.fans) {
            if (fan != article.author._id)
                await notifyManager.createNotify(author, fan, article._id, 'CommentOnFollowed');
        }
        return article.comments[len - 1].date;
     }

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
        for (fan of article.fans) {
            if (fan != article.author)
                await notifyManager.createNotify(article.author, fan, article._id, 'UpdateOnFollowed');
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
        let article = await Article.findById(articleId)
                                   .populate('author');
        if (!article)
            throw "no such article";
        if (article.finished) {
            if (!set) {
                article.finished = false;
                // await accountManager.changeScore(article.author, -100);
                article.author.changeScore(-100);
                article.author.nFinishedPosts -= 1;
            }
        } else {
            if (set) {
                article.finished = true;
                // await accountManager.changeScore(article.author, 100);
                article.author.changeScore(100);
                article.author.nFinishedPosts += 1;
            }
        }
        await article.author.save();
        await article.save();
        for (fan of article.fans){
            if (fan != article.author._id)
                await notifyManager.createNotify(article.author._id, fan, article._id, 'UpdateOnFollowed');
        }
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
    /**
     * 
     * @param {String} stringToBeParse 
     * @returns {Array} users
     */
    this.tagTextParse = async function(stringToBeParse) {
        let users = [];
        const pattern = /(?:\s|^)@(\w+)/;
        while (stringToBeParse) {
            let found = stringToBeParse.match(pattern);
            if (!found)
              break;
            let plain_text = stringToBeParse.substring(0, found.index);
            stringToBeParse = stringToBeParse.substring(found.index + found[0].length);
            users.push(found[1]);
        }
        if (users) {
            users = [...new Set(users)];  //Use set to wipe out duplicated user
                                          //a = ['a','a','b','c']; 
                                          //[...new Set(a)] = ['a','b','c'];
        }
        let userIds = [];
        for (user of users) {
            let tmp = await User.findOne({ username: user });
            userIds.push(tmp._id);
        }
        return userIds;
    }
}


