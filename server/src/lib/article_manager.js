const Article = require('../models/Article');
const User = require("../models/User");

module.exports = function() {

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
            throw error;
        }
    }

    // this.hasCommentInArticle = function(commentId, articleId) {
    //     return Number(commentId) <= this.articles[Number(articleId)].comments.length
    // }

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
            throw error;
        }
    }

    /**
     * @returns the json object containing all articles with frontend format
     */
    this.getAllArticleIds = async function(options) {
        try {
            let allArticleIds = [];
            let rawArticles = await Article.find({})
                                           .then((allArticles) => {
                                               return allArticles;
                                           });
            if (options) {
                if (options.includes('new2old')) {
                    console.log('new2old');
                    rawArticles.sort((a, b) => {
                        return b.date - a.date;
                    });
                } else if (options.includes('old2new')) {
                    console.log('old2new');
                    rawArticles.sort((a, b) => {
                        return a.date - b.date;
                    });
                }
                if (options.includes('finished')) {
                    rawArticles.sort((a, b) => {
                        return a.finished - b.finished;
                    });
                }
            }
            for (article of rawArticles) {
                allArticleIds.push(article._id);
            }
            return allArticleIds;
        } catch (error) {
            throw error;
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

    this.sortArticleIdsByOptions = async function(articleIds, options) {
        let articles = await Article.find({ '_id': { $in: articleIds } })
                                    .exec()
                                    .then((articles) => {
                                        return articles;
                                    });
        if (options) {
            if (options.includes('new2old')) {
                console.log('new2old');
                articles.sort((a, b) => {
                    return b.date - a.date;
                });
            } else if (options.includes('old2new')) {
                console.log('old2new');
                articles.sort((a, b) => {
                    return a.date - b.date;
                });
            }
            if (options.includes('finished')) {
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
            throw error;
        }
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
        try {
            let article = await Article.findById(articleId);
            if (!article)
                throw "no such article";
            if (!author)
                throw "author is required";
                
            let newComment = {
                "author": author,
                "body": commentStr,
            };
            try {
                await article.comments.push(newComment);
                let len = article.comments.length;
                let res = await article.save();
                return res.comments[len - 1].date;
            } catch(e) {
                console.log(e);
                throw e;
            }
        } catch (e) {
            throw "no such article";
        }
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
        try {
            console.log(articleId);
            let article = await Article.findById(articleId);
            if (!article)
                throw "no such article";
            if (userId != article.author)
                throw "not the author";
            article.title = newArticle.title;
            article.body = newArticle.body;
            article.date = Date.now();
            await article.save();
            return article.date;
        } catch(e) {
            console.log(e);
            throw e;
        }
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
     * Now the milestone has no id
     * However we need to add an id
     * later for better management
     * such as editing milestone or
     * editing the article contaned in
     * each milestone
     */
    // this.addMilestoneToArticle = function(articleId, milestone) {
    //     if (!this.hasArticle(articleId)) {
    //         throw "no such article";
    //     }
    //     let article = this.articles[Number(articleId)];
    //     let newMilestoneId = String(article.wishes.length);
    //     let newMilestone = {
    //         title: milestone.title,
    //         body: milestone.body,
    //         time: milestone.time,
    //         id: newMilestoneId,
    //     };
    //     article.wishes.push(newMilestone);
    //     synchronize(this.articles, this.articlePATH);
    //     return newMilestone;
    // }
}