const bcrypt = require('bcrypt');
const User = require('../models/User');
var ArticleManager = require('./article_manager.js');

module.exports = function() {
    this.articleManager = new ArticleManager();

    this.accountsPATH = __dirname + "/../data/accounts.json";
    this.accounts_info = require(this.accountsPATH);
    this.user_listPATH = __dirname + "/../data/user_list.json";
    this.user_list = require(this.user_listPATH);
    
    this.findUserbyUsername = function(username) {
        return User.findOne({ username: username }).exec();
    }

    /**
     * @param {String} username 
     * @returns if the user is in the list
     */
    this.hasUser = async function(username) {
        try {
            return await User.findOne({username: username})
                             .exec()
                             .then((user) => {
                                 return user != null;
                             })
        } catch {
            throw "db access failed";
        }
    }
    
    /**
     * @description the following code is to print all users stored in db to 
     *              the console for debugging
     */
    this.getAllUsers = function() {
        User.find().exec((err, res) => {
            if (err) console.log(err);
            console.log(res);
        });
    }
    
    /**
     * @description the following code is to delete all existing users stored
     *              in db for debugging
     */
    this.clearAllUsers = function() {
        User.deleteMany()
            .exec((err, res) => {
                if (err) console.log(err);
                console.log(res);
            });
    }

    /**
     * @param {String} username 
     * @param {String} password 
     * @returns if the password matches the username
     * @throws "user not found" exception
     */
    this.checkPassword = async function(username, password) {
        try {
            let user = await User.findOne({username: username})
                                 .exec()
                                 .then((user) => {
                                     return user;
                                 });
            if (user) {
                let result = {
                    correct: bcrypt.compareSync(password, user.password),
                    userId: user._id,
                }
                return result;
            }
        } catch (error) {
            throw "db access failed";
        }
        throw "user not found";
    }

    /**
     * @param {String} username 
     * @param {String} password 
     * @throws "duplicated user" exception
     */
    this.addUser = async function(username, password) {
        var duplicated;
        try {
            duplicated = await User.findOne({username: username})
                                   .exec()
                                   .then((user) => {
                                       return user != null;
                                   });
            if (!duplicated) {
                // let newUserId = String(Object.keys(this.user_list).length);
                let hash = bcrypt.hashSync(password, 10);
                let newUserData = {
                    "username": username,
                    "password": hash,
                };
                const user = new User(newUserData);
                user.save();
                return;  // if the function is executed normally
            }
        } catch (error) {
            throw 'db access failed';
        }
        throw 'duplicated user';
    }
    
    this.setSelfIntroToUser = async function(userId, selfIntro) {
        var user;
        try {
            user = await User.findById(userId)
                             .exec()
                             .then((user) => {
                                 return user;
                             });
            if (user) {
                user.selfIntro = selfIntro;
                user.save();
                return;
            }
        } catch (error) {
            throw 'db access failed';
        }
        throw "user not found";
    }
    
    this.setHonorToUser = async function(userId, honor) {
        var user;
        try {
            user = await User.findById(userId)
                             .exec()
                             .then((user) => {
                                 return user;
                             });
            if (user) {
                user.honor = honor;
                let error = user.validateSync();
                if (error) {
                    throw error;
                }
                user.save();
                return;
            }
        } catch (error) {
            throw error;
        }
        throw "user not found";
    }

    this.setProPicToUser = async function(userId, proPicUrl) {
        try {
            let user = await User.findById(userId)
                                 .exec()
                                 .then((user) => {
                                     return user;
                                 });
            if (user) {
                user.proPic = proPicUrl;
                user.save();
                return;
            }
        } catch (error) {
            throw 'db access failed';
        }
        throw "user not found";
    }

    /**
     * @param {String} id 
     * @returns user info with given id
     * @throws "user not found" exception
     */
    this.getUserInfo = async function(id) {
        try {
            let user = await User.findById(id)
                                 .exec()
                                 .then((user) => {
                                     return user;
                                 })
            if (user) {
                let userInfo = {
                    "id": user._id,
                    "username": user.username,
                    "selfIntro": user.selfIntro,
                    "honor": user.honor,
                    "proPic": user.proPic,
                    "nFans": user.fans.length,
                    "nFollowing": user.followedUsers.length,
                    "nPosts": user.selfPosts.length,
                };
                return userInfo;
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
        throw "user not found"
    }

    /**
     * @param {String} username 
     * @returns id of given username
     */
    this.getIdbyUsername = async function(username) {
        try {
            let user = await User.findOne({ username: username })
                                 .exec()
                                 .then((user) => {
                                     return user;
                                 })
            if (user) {
                return user._id;
            }
        } catch (error) {
            throw 'db access failed';
        }
        throw "user not found";
    }

    /**
     * To make an user to follow/unfollow another user
     * 
     * @param {String} userId 
     * @param {String} targetId
     * @throws "user not found"
     */
    this.toggleFollowRelation = async function(userId, targetId) {
        try {
            let target = await User.findById(targetId)
                                   .exec()
                                   .then((target) => {
                                       return target;
                                   });
            if (target) {
                let user  = await User.findById(userId)
                                      .exec()
                                      .then((user) => {
                                          return user;
                                      });
                if (user) {
                    if (user.followedUsers.includes(target._id)) {
                        // In this case it is going to unfollow
                        user.followedUsers.pull(target._id);
                        target.fans.pull(user._id);
                    } else {
                        // In this case it is going to follow
                        user.followedUsers.push(target._id);
                        target.fans.push(user._id);
                    }
                    user.save();
                    target.save();
                    return;
                }
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
        throw "user not found";
    }

    /**
     * To make an user to follow/unfollow the given post
     * 
     * @param {String} userId 
     * @param {String} articleId 
     * @throw "user not found", "no such article" or "article already followed" exception
     */
    this.toggleFollowedPostsToUser = async function(userId, articleId) {
        try {
            let article = await this.articleManager.getArticleById(articleId)
                                                   .then((article) => {
                                                       return article;
                                                   });
            if (article) {
                let user = await User.findById(userId)
                                     .exec()
                                     .then((user) => {
                                         return user;
                                     });
                if (user) {
                    console.log(user.username);
                    if (user.followedPosts.includes(article._id)) {
                        // In this case it is going to unfollow
                        console.log('unfollow');
                        user.followedPosts.pull(article._id);
                        article.fans.pull(user._id);
                    } else {
                        // In this case it is going to follow
                        console.log('follow');
                        user.followedPosts.push(article._id);
                        article.fans.push(user._id);
                    }
                    console.log(article._id);
                    user.save();
                    article.save();
                    return;
                }
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
        throw "user not found"
    }
    
    this.toggleLikedPostsToUser = async function(userId, articleId) {

    }

    /**
     * @param {String} userId 
     * @param {Object} articleContent: {String} title, {String} body and {Array} wishes
     * @throws "user not found" exception
     * @return {Number} newPostId
     */
    this.addPostsToAuthor = async function(userId, articleContent) {
        try {
            let author = await User.findById(userId)
                                   .exec()
                                   .then((user) => {
                                       return user;
                                   });
            if (author) {
                let newPostId = this.articleManager.addArticle(author, articleContent)
                author.selfPosts.push(newPostId);
                author.save();
                return newPostId;
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
        throw "user not found";
    }

    /**
     * @param {String} username 
     * @returns all posts of user's followee or user following posts
     * @throws "user not found" exception
     */
    this.getFollowedPostsByUser = function(username) {
        if (!this.hasUser(username)) {
            throw "user not found";
        }
        let account = this.accounts_info.find(account => account.username == username);
        let posts = [];
        posts.push.apply(posts, account.followedPosts);
        for (followeeId in account.followees) {
            let followee = this.accounts_info[Number(followeeId)];
            for (postOfFollowees in followee.selfPosts) {
                console.log(postOfFollowees);
                if (!posts.includes(postOfFollowees)) {
                    posts.push(postOfFollowees);
                }
            }
        }
        return posts;
    }
    
    /**
     * 
     * @param {String} username 
     * @returns the user's post
     * @throws "user not found" exception
     */
    this.getPostsByAuthor = function(username) {
        if (!this.hasUser(username)) {
            throw "user not found";
        }
        let author = this.accounts_info.find(account => account.username == username);
        return author.selfPosts;
    }

    /**
     * @param {String} username 
     * @param {String} articleId 
     * @param {String} commentStr 
     * @throws "user not found" exception
     */
    this.addCommentByAuthor = function(username, articleId, commentStr) {
        if (!this.hasUser(username)) {
            throw "user not found";
        }
        let author = this.accounts_info.find(account => account['username'] == username)
        this.articleManager.addCommentToArticle(author, articleId, commentStr);
    }
};