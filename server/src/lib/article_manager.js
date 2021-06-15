// const fs = require("fs");
// var d = new Date();
// var month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
// var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
// var today = `${month[d.getMonth()]}/${String(d.getDate())} ${days[d.getDay()]}`;
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
                                           .populate('author')
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
    
    // this.getMultipleArticlesByIds = async function(articleIds, options) {
    //     let articles = [];
    //     for (articleId of articleIds) {
    //         await this.getFormatedArticleById(articleId)
    //                   .then((article) => {
    //                       articles.push(article);
    //                   });
    //     }
    //     if (options.includes('new2old')) {
    //         console.log('new2old');
    //         articles.sort((a, b) => {
    //             return b.date - a.date;
    //         });
    //     } else if (options.includes('old2new')) {
    //         console.log('old2new');
    //         articles.sort((a, b) => {
    //             return a.date - b.date;
    //         });
    //     }
        
    //     if (options.includes('finished')) {
    //         articles.sort((a, b) => {
    //             return a.finished - b.finished;
    //         });
    //     }

    //     return articles;
    // }

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
     * @returns {Object} newComment
     */
     this.addCommentToArticle = async function(author, articleId, commentStr){
        try{
            let article = await Article.findById(articleId);
            if(article){
                let newComment = {
                    "author":author,
                    "body":commentStr,
                }
                try{
                const len = await article.comments.push(newComment);
                const res = await article.save();
                return res.comments[len-1].date;
                }catch(e){
                    console.log(e);
                }
            }
        }catch(e){
            throw "no such article";
        }
     }
    


    // this.addCommentToArticle = function(author, articleId, commentStr) {
    //     if (!this.hasArticle(articleId)) {
    //         throw "no such article";
    //     }
    //     let article = this.articles[Number(articleId)];
    //     let newCommentId = String(article.comments.length);
    //     let newCommentData = {
    //         "id": newCommentId,
    //         "date": today,
    //         "body": commentStr,
    //         "from": author.id
    //     }
    //     let newNewComment = newComment(newCommentData);
    //     article.comments.push(newNewComment);
    //     synchronize(this.articles, this.articlePATH);
    //     return newNewComment;
    // }

    /**
     * Replace the body and title of an article
     * 
     * @param {Object} newComment 
     * @param {String} articleId 
     * @param {String} commentId 
     * 
     * @throws "no such article" exception
     */
    // this.replaceArticle = function(newArticle, articleId) {
    //     if (!this.hasArticle(articleId)) {
    //         throw "no such article";
    //     } this.articles[Number(articleId)].title = newArticle.title;
    //     this.articles[Number(articleId)].body = newArticle.body;
    //     synchronize(this.articles, this.articlePATH);
    // }

    /**
     * Replace a comment body in an article
     * 
     * @param {Object} newComment 
     * @param {String} articleId 
     * @param {String} commentId 
     * 
     * @throws "no such article" exception
     */
    this.replaceCommentOfArticle = async function(newComment, articleId, commentId){
        console.log(commentId);
        let result = await Article.findOne({
           "_id": articleId,
        },
            {
                comments:{
                    "$elemMatch":{"_id": commentId}
               }
            },
            {"comments":1}   //So we only get 1 comment obj instead of whole document
        );
        if(result){
        result.comments[0]['body']=newComment;  //Modified exist's comment
        console.log(Date.now());
        //result.comments[0]['date']=Date.now; //Throw type err
        await result.save();
        }
        return;
    }
    // this.replaceCommentOfArticle = function(newComment, articleId, commentId) {
    //     if (!this.hasArticle(articleId)) {
    //         throw "no such article";
    //     }
    //     if (!this.hasCommentInArticle(commentId, articleId)) {
    //         throw "no such comment"
    //     }
    //     this.articles[Number(articleId)].comment[Number(commentId)].body = newComment;
    //     synchronize(this.articles, this.articlePATH);
    // }

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

    /**
     * 
     * @param {Number} choose 
     * @returns choose = 1 : Month
     * @returns choose = 2 : Month/Date
     * @returns choose else : Month/Date Day
     */
    // this.getToday = function(choose){
    //     if (choose === 1)
    //         return today.split('/')[0];             //return Month
    //     else if (choose === 2)
    //         return today.split(' ')[0];             //return Month/Date
    //     else
    //         return today;                           //return Month/Date Day
    // }
}