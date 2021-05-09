// this class is to manage all users
// or simply manage the data stored in json files
const fs = require("fs");

module.exports = function() {
    this.accountsPATH = __dirname + "/../data/accounts.json";
    this.accounts_info = require(this.accountsPATH);
    this.user_listPATH = __dirname + "/../data/user_list.json";
    this.user_list = require(this.user_listPATH);
    this.articlePATH = __dirname + "/../data/articles.json";
    this.articles = require(this.articlePATH);

    /**
     * @param {String} username 
     * @returns if the user is in the list
     */
    this.hasUser = function(username) {
        console.log(`check for ${username}`);
        return username in this.user_list;
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
        return account.password == password;
    }

    /**
     * @param {String} username 
     * @param {String} password 
     * @throws "duplicated user" exception
     */
    this.addUser = function(username, password) {
        if (this.hasUser(username)) {
            throw "duplicated user";
        }
        let newUserId = String(Object.keys(this.user_list).length);
        let newUserData = {
            "id": newUserId,
            "username": username,
            "password": password
        }
        this.user_list[username] = newUserId;
        this.accounts_info.push(newAccountInfo(newUserData));
        synchronize(this.user_list, this.user_listPATH);
        synchronize(this.accounts_info, this.accountsPATH);
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
        let follower = this.accounts_info.find(account => account['username'] == username)
        let followee = this.accounts_info.find(account => account['username'] == target)
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
     * 
     * @param {String} username 
     * @param {Object} post: {String} title, {String} body and {Array} wishes
     * @throws "user not found" exception
     */
    // not finished yet QQ may use article manager later
    this.addPostsToAuthor = function(username, post) {
        if (!this.hasUser(username)) {
            throw "user not found";
        }
        let author = this.accounts_info.find(account => account['username'] == username)
        let newPostId = articles.length;
        let newPostData = {
            "id": newPostId,
            "from": author.id,
            "body": post.body,
            "title": post.title,
            "date": today,
            "wishes": post.wishes
        };
        this.articles.push(newArticle(newPostData));
        author.selfPosts.push(newPostId);
    }

    // getPostsByUser: this method should return the id array of 
    // all related posts of a user

    // addCommentByAuthor
};

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
}