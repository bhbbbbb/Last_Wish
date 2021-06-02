const bcrypt = require('bcrypt');
const fs = require("fs");
// const mongoose = require('mongoose');
const User = require('../models/User');
var ArticleManager = require('./article_manager.js');

module.exports = function() {
    this.articleManager = new ArticleManager();

    this.accountsPATH = __dirname + "/../data/accounts.json";
    this.accounts_info = require(this.accountsPATH);
    this.user_listPATH = __dirname + "/../data/user_list.json";
    this.user_list = require(this.user_listPATH);

    /**
     * @param {String} username 
     * @returns if the user is in the list
     */
    this.hasUser = function(username) {
        // I don't know how to write with mongoose
    }
    
    /**
     * @description the following code is to print all users stored in db to 
     *   the console
     */
    this.getAllUsers = function() {
        User.find().exec((err, res) => {
            if (err) console.log(err);
            console.log(res);
        });
    }
    
    /**
     * @description the following code is to delete all existing users stored
     *   in db
     */
    this.clearAllUsers = function() {
        User.remove().exec((err, res) => {
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
    this.checkPassword = function(username, password) {
        if (!this.hasUser(username)) {
            throw "user not found";
        }
        let account = this.accounts_info.find(account => account.username == username);
        // let account = this.accounts_info[Number(this.user_list[username])];
        // return account.password == password;
        return bcrypt.compareSync(password, account.password);
    }

    /**
     * @param {String} username 
     * @param {String} password 
     * @throws "duplicated user" exception
     */
    this.addUser = function(username, password) {
        // if (this.hasUser(username)) {
        //     throw "duplicated user";
        // }
        User.findOne({ username: username}, (err, user) => {
            if (err) {
                console.log(err);
                return;
            }
            
            if (res) {
                console.log(user);
                throw "duplicated user";
            }

            let hash = bcrypt.hashSync(password, 10);
            let newUserData = {
                "username": username,
                "password": hash,
            };
            const newUser = new User(newUserData);
            newUser.save();
        });
        // let newUserId = String(Object.keys(this.user_list).length);
        // this.user_list[username] = newUserId;
        // this.accounts_info.push(newAccountInfo(newUserData));
        // synchronize(this.user_list, this.user_listPATH);
        // synchronize(this.accounts_info, this.accountsPATH);
    }

    /**
     * @param {String} id 
     * @returns user info with given id
     * @throws "user not found" exception
     */
    this.getUserInfo = function(id) {
        let account = this.accounts_info.find(account => account.id == id);
        if (!account) {
            throw "user not found";
        }
        let userInfo = {
            "id": account.id,
            "username": account.username
        };
        return userInfo;
    }

    /**
     * @param {String} username 
     * @returns id of given username
     */
    this.getIdbyUsername = function(username) {
        if (!this.hasUser(username)) {
            return "0";
            // throw "user not found";
        }
        return this.user_list[username];
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
        if (!this.hasUser(username)) {
            throw "user not found";
        }
        if (!this.hasUser(target)) {
            throw "target not found";
        }
        if (username == target) {
            throw "username cannot be target";
        }
        let follower = this.accounts_info.find(account => account['username'] == username);
        let followee = this.accounts_info.find(account => account['username'] == target);
        if (isFollow) {
            if (follower.followees.includes(followee.id)) {
                throw "target already followed"
            }
            follower.followees.push(followee.id);
            followee.followers.push(follower.id);
        } else {
            if (!follower.followees.includes(followee.id)) {
                throw "target already unfollowed"
            }
            follower.followees.splice(follower.followees.indexOf(followee.id), 1);
            followee.followers.splice(followee.followers.indexOf(follower.id), 1);
        }
        synchronize(this.accounts_info, this.accountsPATH);
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
     * To make an user to unfollow the given post
     * 
     * @param {String} username 
     * @param {String} articleId 
     * @throw "user not found", "no such article" or "article already unfollowed" exception
     */
    /*
    this.removeFollowedPostsFromUser = function(username, articleId) {
        if (!this.hasUser(username)) {
            throw "user not found";
        }
        if (!this.articleManager.hasArticle(articleId)) {
            throw "no such article";
        }
        let follower = this.accounts_info.find(account => account['username'] == username);
        if (!follower.followedPosts.include(articleId)) {
            throw "article already unfollowed";
        }
        follower.followedPosts.splice(follower.followedPosts.indexOf(articleId), 1);
        synchronize(this.accounts_info, this.accountsPATH);
    }
    */

    /**
     * @param {String} username 
     * @param {Object} article: {String} title, {String} body and {Array} wishes
     * @throws "user not found" exception
     * @return {Number} newPostId
     */
    this.addPostsToAuthor = function(username, article) {
        if (!this.hasUser(username)) {
            throw "user not found";
        }
        let author = this.accounts_info.find(account => account['username'] == username);
        let newPostId = this.articleManager.addArticle(author, article);
        author.selfPosts.push(newPostId);
        synchronize(this.accounts_info, this.accountsPATH);
        return newPostId;
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

/*
function newAccountInfo(newUserData) {
    let template = {
        "id": "",
        "username": "",
        "password": "",
        "followers": [],
        "followees": [],
        "followedPosts": [],
        "selfPosts": []
    };
    for (keys in newUserData) {
        template[keys] = newUserData[keys];
    }
    return template;
}

function synchronize(obj, path) {
    let data = JSON.stringify(obj, null, 4);
    fs.writeFile(path, data, (err) => {
        if (err) console.log(err);
    });
}*/