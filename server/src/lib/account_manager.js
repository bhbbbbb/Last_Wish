const bcrypt = require('bcrypt');
const User = require('../models/User');
var ArticleManager = require('./article_manager.js');

module.exports = function() {
    this.articleManager = new ArticleManager();

    this.findUserbyUsername = function(username) {
        return User.findOne({ username: username }).exec();
    }

    /**
     * @param {String} username 
     * @returns user liked posts
     */    
    this.getUserLiked = async function(userId) {
        let user = await User.findById(userId);
        if (user)
            return user.likedPosts;
        else
            return null;
    }

    /**
     * @param {String} username 
     * @param {String} nonce
     */
    this.setNonceToUser = async function(username, nonce) {
        let user = await User.findOne({ username: username })
        if (!user)
            throw "user not found";
        user.nonce = nonce;
        user.save();
        return;
    }

    /**
     * @param {String} username 
     * @returns if the user is in the list
     */
    this.hasUser = async function(username) {
        return await User.findOne({username: username}) != null;
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
     * @returns if the user is verified
     * @returns null if user not found;
     */
     this.checkVerified = async function(username) {
        let user = await User.findOne({ username: username });
        if (!user)
            return null;
        let result = {
           verified: user.verified,
           email: user.email,
           id: user._id,
        };
        return result;
    }

    /**
     * @param {String} username 
     * @param {String} password 
     * @returns if the password matches the username
     * @throws "user not found" exception
     */
    this.checkPassword = async function(username, password) {
        let user = await User.findOne({ username: username });
        if (!user)
            throw "user not found";
        let result = {
            correct: bcrypt.compareSync(password, user.password),
            userId: user._id,
            verified: user.verified,
            email: user.email,
        }
        return result;
    }

    /**
     * @param {String} username 
     * @param {String} password 
     * @throws "duplicated user" exception
     */
    this.addUser = async function(username, password, email) {
        let duplicated = await User.findOne({ username: username }) != null;
        if (duplicated)
            throw "duplicated user";
        let hash = bcrypt.hashSync(password, 10);
        let newUserData = {
            "username": username,
            "password": hash,
            "email": email,
        };
        const user = new User(newUserData);
        await user.save();
        return user._id;  // if the function is executed normally
    }
    
    this.setSelfIntroToUser = async function(userId, selfIntro) {
        let user = await User.findById(userId)
        if (!user)
            throw "user not found";
        user.selfIntro = selfIntro;
        user.save();
        return;
    }
    
    this.setHonorToUser = async function(userId, honor) {
        let user = await User.findById(userId);
        if (!user)
            throw "user not found";
        user.honor = honor;
        let error = user.validateSync();
        if (error)
            throw error;
        user.save();
        return;
    }

    this.setProPicToUser = async function(userId, proPicUrl) {
        let user = await User.findById(userId);
        if (!user)
            throw "user not found";
        user.proPic = proPicUrl;
        user.save();
        return;
    }

    /**
     * @param {String} id 
     * @returns user info with given id
     * @throws "user not found" exception
     */
    this.getUserInfo = async function(id) {
        let user = await User.findById(id);
        if (!user)
            throw "user not found"
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

    /**
     * @param {String} username 
     * @returns id of given username
     */
    this.getIdByUsername = async function(username) {
        let user = await User.findOne({ username: username });
        if (!user)
            throw "user not found";
        return user._id;
    }

    /**
     * To make an user to follow/unfollow another user
     * 
     * @param {String} userId 
     * @param {String} targetId
     * @throws "user not found"
     */
    this.toggleFollowRelation = async function(userId, targetId) {
        let target = await User.findById(targetId);
        if (!target)
            throw "user not found";
        let user  = await User.findById(userId);
        if (!user)
            throw "user not found";
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

    /**
     * To make an user to follow/unfollow the given post
     * 
     * @param {String} userId 
     * @param {String} articleId 
     * @throw "user not found"
     */
    this.toggleFollowedPostsToUser = async function(userId, articleId) {
        let article = await this.articleManager.getArticleById(articleId);
        if (article) {
            let user = await User.findById(userId);
            if (!user)
                throw "user not found"
            if (user.followedPosts.includes(article._id)) {
                // In this case it is going to unfollow
                user.followedPosts.pull(article._id);
                article.fans.pull(user._id);
            } else {
                // In this case it is going to follow
                user.followedPosts.push(article._id);
                article.fans.push(user._id);
            }
            user.save();
            article.save();
            return;
        }
    }
    
    this.toggleLikedPostsToUser = async function(userId, articleId) {
        let article = await this.articleManager.getArticleById(articleId);
        if (article) {
            let user = await User.findById(userId);
            if (!user)
                throw "user not found"
            if (user.likedPosts.includes(article._id)) {
                // In this case it is going to like
                user.likedPosts.pull(article._id);
                article.likes -= 1;
            } else {
                // In this case it is going to dislike
                user.likedPosts.push(article._id);
                article.likes += 1;
            }
            user.save();
            article.save();
            return;
        }
    }

    /**
     * @param {String} userId 
     * @param {Object} articleContent: {String} title, {String} body and {Array} wishes
     * @throws "user not found" exception
     * @return {Number} newPostId
     */
    this.addPostsToAuthor = async function(userId, articleContent) {
        let author = await User.findById(userId);
        if (!author)
            throw "user not found";
        let newPostId = await this.articleManager.addArticle(author, articleContent);
        author.selfPosts.push(newPostId);
        author.save();
        return newPostId;
    }

    /**
     * @param {String} username 
     * @returns all articleId of user's followedUsers and followedPosts
     * @throws "user not found" exception
     */
    this.getFollowedPostsByUser = async function(userId) {
        let user = await User.findById(userId)
                             .populate('followedUsers');
        if (!user)
            throw "user not found"; 
        let articleIds = [];
        articleIds.push.apply(articleIds, user.followedPosts);
        for (followedUser of user.followedUsers) {
            for (userPost of followedUser.selfPosts) {
                if (!articleIds.includes(userPost)) {
                    articleIds.push(userPost);
                }
            }
        }
        return articleIds;
    }
    
    /**
     * 
     * @param {String} username 
     * @returns the user's post
     * @throws "user not found" exception
     */
    this.getPostsByAuthor = async function(userId) {
        let author = await User.findById(userId);
        if (!author)
            throw "user not found";
        return author.selfPosts;
    }

    /**
     * Add event into user's event list
     * @param {obj} event 
     * @param {String} userId 
     * @throws "user not found" exception
     */
    this.addEventToUser = async function(event, userId) {
        let user = await User.findById(userId).exec();
        if (!user)
            throw "user not found";
        let len = await user.events.push(event);
        await user.save();
        console.log(user.events);
        return user.events[len - 1]._id;
    }

    /**
     * get user's events by userId
     * @param {String} userId 
     * @throws "user not found" exception
     */
    this.getUserEvent = async function(userId) {
        let user = await User.findById(userId);
        if (!user)
            throw "user not found";
        return user.events;
    }

    /**
     * replace existed event with modifiedEvent obj
     * @param {String} eventId 
     * @param {String} userId
     * @param {obj} modifiedEvent
     * @throws "user not found" exception
     * @throws "event not found" exception
     * @returns event of eventId if event exist
     */
    this.editEventById = async function(eventId, userId, modifiedEvent) {
        let user = await User.findById(userId);
        if (!user)
            throw "user not found";
        let event = await user.events.id(eventId);
        if (!event)
            throw "event not found";
        await event.set(modifiedEvent);
        await user.save()
        return;
    }
};