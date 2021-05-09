const fs = require("fs");
var d = new Date();
var month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
var today = `${month[d.getMonth()]}/${String(d.getDate())} ${days[d.getDay()]}`;

module.exports = function() {
    this.articlePATH = __dirname + "/../data/articles.json";
    this.articles = require(this.articlePATH);

    /**
     * @param {String} id 
     * @returns if there is an article with such id
     */
    this.hasArticle = function(id) {
        return Number(id) <= this.articles.length;
    }

    /**
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
     * Overloading method to post a article anonymously
     * @param {Object} article = {body, title, wishes}
     * @returns {String} the new article id
     */
    this.addArticle = function(article) {
        let newArticleId = String(this.articles.length);
        let newArticleData = {
            "id": newArticleId,
            "from": "-1",
            "body": article.body,
            "title": article.title,
            "date": today,
            "wishes": article.wishes
        };
        this.articles.push(newArticle(newArticleData));
        synchronize(this.articles, this.articlePATH)
        return newArticleId;
    }

    /**
     * @returns the json object containing all articles
     */
    this.getAllArticles = function() {
        return this.articles;
    }

    /**
     * @param {Object} author 
     * @param {String} articleId 
     * @param {String} commentStr 
     * @throws "no such article" exception
     */
    this.addCommentToArticle = function(author, articleId, commentStr) {
        if (!this.hasArticle(articleId)) {
            throw "no such article";
        }
        let article = this.articles[Number(articleId)];
        console.log(article,'WWW');
        let newCommentId = String(article.comments.length);
        let newCommentData = {
            "id": newCommentId,
            "date": today,
            "body": commentStr,
            "from": author.id
        }
        article.comments.push(newComment(newCommentData));
    }
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