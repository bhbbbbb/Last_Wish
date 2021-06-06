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
    
    this.setSelfIntroToUser = async function(username, selfIntro) {
        var user;
        try {
            user = await User.findOne({username: username})
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
    
    this.setHonorToUser = async function(username, honor) {
        var user;
        try {
            user = await User.findOne({username: username})
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

    this.setProPicToUser = async function(username, proPicUrl) {
        try {
            let user = await User.findOne({username: username})
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
                    "nFollowing": user.followingUsers.length,
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
     * @param {String} username 
     * @param {String} target 
     * @param {Boolean} isFollow 
     * @throws "user not found", "target not found", "username cannot be target",
     *         "target already followed" or "target already unfollowed" exceptions 
     */
    this.setFollowRelation = function(username, target, isFollow) {
        try {
            
        } catch (error) {
            
        }
    }

    /**
     * To make an user to follow the given post
     * 
     * @param {String} username 
     * @param {String} articleId 
     * @throw "user not found", "no such article" or "article already followed" exception
     */

    //I change addFollowedPoststoUser into toggle... funq for easier management
    //Mind that Line 147 used to be ...include, however it can be used on string only
    //while follower.followedPosts is an obj.
    this.toggleFollowedPostsToUser = function(username, articleId) {
        if (!this.hasUser(username)) {
            throw "user not found";
        }
        if (!this.articleManager.hasArticle(articleId)) {
            throw "no such article";
        }
        let follower = this.accounts_info.find(account => account['username'] == username);
        if (follower.followedPosts.indexOf(articleId) > -1) {     
            follower.followedPosts.splice(follower.followedPosts.indexOf(articleId), 1);
            //throw "article already followed";
        } else {
            follower.followedPosts.push(articleId);
        }
        synchronize(this.accounts_info, this.accountsPATH);
    }

    /**
     * @param {String} username 
     * @param {Object} article: {String} title, {String} body and {Array} wishes
     * @throws "user not found" exception
     * @return {Number} newPostId
     */
    this.addPostsToAuthor = async function(username, articleContent) {
        try {
            let author = await User.findOne({ username: username })
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