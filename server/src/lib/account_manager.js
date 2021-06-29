const bcrypt = require('bcrypt');
const User = require('../models/User');
const ArticleManager = require('./article_manager');
const NotifyManager = require('./notify_manager');
var notifyManager = new NotifyManager();
module.exports = function() {
    this.articleManager = new ArticleManager();

    this.findUserbyUsername = async function(username) {
        return await User.findOne({ username: username });
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
    this.getPublicInfoById = async function(id) {
        let user = await User.findById(id);
        if (!user)
            throw "user not found"
        return user.getPublicInfo();
    }
    
    this.getHomePageInfoById = async function(id) {
        let user = await User.findById(id);
        if (!user)
            throw "user not found"
        return user.getHomePageInfo();
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
    
    this.searchUsersByKeywords = async function(keywordStr) {
        // const updateFuzzy = require('./update_fuzzy');
        // await updateFuzzy(User, ['username']);
        let users = await User.fuzzySearch(keywordStr);
        return users.map(user => user._id);
    }

    /**
     * To make an user to follow/unfollow the given post
     * 
     * @param {String} userId 
     * @param {String} articleId 
     * @throw "user not found"
     */
    this.setFollowedPostsToUser = async function(userId, articleId, set) {
        let article = await this.articleManager.getArticleById(articleId);
        if (article) {
            let user = await User.findById(userId);
            if (!user)
                throw "user not found"
            if (user.followedPosts.includes(article._id)) {
                // In this case it is going to unfollow
                if (!set) {
                    user.followedPosts.pull(article._id);
                    article.fans.pull(user._id);
                }
            } else {
                // In this case it is going to follow
                if (set) {
                    user.followedPosts.push(article._id);
                    article.fans.push(user._id);
                }
            }
            await user.save();
            await article.save();
        }
    }
    
    this.setLikedPostsToUser = async function(userId, articleId, set) {
        let article = await this.articleManager.getArticleById(articleId);
        if (article) {
            let user = await User.findById(userId);
            if (!user)
                throw "user not found"
            if (user.likedPosts.includes(article._id)) {
                // In this case it is going to dislike
                if (!set) {
                    user.likedPosts.pull(article._id);
                    article.likes -= 1;
                    // await this.changeScore(article.author, -2);
                    article.author.changeScore(-2);
                    article.author.likedCount -= 1;
                }
            } else {
                // In this case it is going to like
                if (set) {
                    user.likedPosts.push(article._id);
                    article.likes += 1;
                    // await this.changeScore(article.author, 2);
                    article.author.changeScore(2);
                    article.author.likedCount += 1;
                }
            }
            await user.save();
            await article.author.save();
            await article.save();
        }
    }

    /**
     * @param {String} userId 
     * @param {Object} articleContent: {String} title, {String} body and {Array} wishes
     * @throws "user not found" exception
     * @return {Number} newPostId
     */
    this.addPostsToAuthor = async function(userId, articleContent, citationId) {
        let author = await User.findById(userId);
        if (!author)
            throw "user not found";
        let newPostId = await this.articleManager.addArticle(author, articleContent, citationId);
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
        // let articleIds = [];
        // articleIds.push.apply(articleIds, user.followedPosts);
        // for (followedUser of user.followedUsers) {
        //     for (userPost of followedUser.selfPosts) {
        //         if (!articleIds.includes(userPost)) {
        //             articleIds.push(userPost);
        //         }
        //     }
        // }
        // return articleIds;
        return user.followedPosts;
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
     * 
     * @param {String} password 
     * @returns hased_pass
     */
    this.hashPass = async (password) => {
        return await bcrypt.hashSync(password, 10);
    }

    this.findUserById = async (id) => {
        return await User.findById(id);
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
    
    this.setFinishedEventById = async function(eventId, userId, set) {
        let user = await User.findById(userId);
        if (!user)
            throw "user not found";
        let event = await user.events.id(eventId);
        if (!event)
            throw "event not found";
        if (event.finished) {
            if (!set) {
                event.finished = false;
                // await this.changeScore(userId, -10);
                user.changeScore(-10);
            }
        } else {
            if (set) {
                event.finished = true;
                // await this.changeScore(userId, 10);
                user.changeScore(10);
            }
        }
        await user.save()
        return;
    }

    this.setEmailToUser = async function(userId, password, email) {
        let user = await User.findById(userId);
        if (!user)
            throw "user not found"
        let correct = bcrypt.compareSync(password, user.password)
        if (correct){
            user.email = email
            await user.save();
        }
        return correct;
    }
    
    this.popAllStashedNotifiesToUser = async function(userId) {
        let user = await User.findById(userId)
        if (!user)
            throw "user not found";
        user.unread += user.stashedNotifies.length;
        while (user.stashedNotifies.length > 0) {
            let notify = user.stashedNotifies.pop();
            user.notifies.push(notify);
        }
        await user.save();
        return user.unread;
    }
    
    this.getAllNotifiesOfUser = async function(userId) {
        let user = await User.findById(userId)
                             .populate({
                                 path: 'notifies',
                                 model: 'Notify',
                                 populate: [{
                                     path: 'from',
                                     model: 'User',
                                 },
                                 {
                                    path: 'link',
                                    model: 'Article',
                                }],
                             })
        if (!user)
            throw "user not found";
        return user.notifies.map(notify => notify.toFrontendFormat())
                            .filter(el => { return el != null })
                            .sort((m, n) => {
                                return n.date - m.date;
                            });
    }
};
