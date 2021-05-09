const fs = require("fs");
var d = new Date();
var month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
var today = `${month[d.getMonth()]}/${String(d.getDate())} ${days[d.getDay()]}`;

module.exports = function() {
    this.articlePATH = __dirname + "/../data/articles.json";
    this.articles = require(this.articlePATH);

    // the method has not finished
    // it should return the id of the new post
    // account manager can retrive the id from the method
    // and add it to its author

    /**
     * 
     * @param {Object} author the account info of the author
     * @param {Object} article = {body, title, wishes}
     * @returns {String} the new article id
     */
    this.addArticle = function(author, article) {
        let newPostId = String(this.articles.length);
        let newPostData = {
            "id": newPostId,
            "from": author.id,
            "body": article.body,
            "title": article.title,
            "date": today,
            "wishes": article.wishes
        };
        this.articles.push(newArticle(newPostData));
        synchronize(this.articles, this.articlePATH)
        return newPostId;
    }

    /**
     * 
     * @param {Object} article = {body, title, wishes}
     * @returns {String} the new article id
     */
    this.addArticle = function(article) {
        let newPostId = String(this.articles.length);
        let newPostData = {
            "id": newPostId,
            "from": "-1",
            "body": article.body,
            "title": article.title,
            "date": today,
            "wishes": article.wishes
        };
        this.articles.push(newArticle(newPostData));
        synchronize(this.articles, this.articlePATH)
        return newPostId;
    }

    this.getAllArticles = function() {
        return this.articles;
    }

    this.addCommentToArticle = function(id, comment) {

    }

    //TODO:
    // addCommentToPost
    // ...

}

function newArticle(newArticleData) {
    let template = {
        "id": "",
        "from": "",
        "body": "",
        "title": "",
        "date": "",
        "wishes": [],
        "comments": []
    };
    for (keys in newArticleData) {
        template[keys] = newArticleData[keys];
    }
    return template;
}

function newComment(newCommentData) {
    let template = {
        "id": "",
        "date": "",
        "body": "",
        "from": ""
    };
    for (keys in newCommentData) {
        template[keys] = newCommentData[keys];
    }
    return template;
}

function synchronize(obj, path) {
    let data = JSON.stringify(obj, null, 4);
    fs.writeFile(path, data, (err) => {
        if (err) console.log(err);
    });
}