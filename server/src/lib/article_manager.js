const fs = require("fs");
var d = new Date();
var month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
var today = `${month[d.getMonth()]}/${String(d.getDate())} ${days[d.getDay()]}`;

module.exports = function() {
    this.articlePATH = __dirname + "/../data/articles.json";
    this.articles = require(this.articlePATH);

    /**
     * @param {String} articleId 
     * @returns if there is an article with such id
     */
    this.hasArticle = function(articleId) {
        return Number(articleId) <= this.articles.length;
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
            "wishes":[]
        };
        newPostData.wishes.push(String(article.wishes)+this.getDay(2));
        this.articles.push(newArticle(newPostData));
        synchronize(this.articles, this.articlePATH);
        return newPostId;
    }

    /**
     * @returns the json object containing all articles
     */
    this.getAllArticles = function() {
        return this.articles;
    }
    
    /**
     * 
     * @param {String} articleId 
     * @returns the article with given article id
     * @trhows "no such article" exception
     */
    this.getArticleById = function(articleId) {
        if (!this.hasArticle(articleId)) {
            throw "no such article";
        }
        return this.articles.find(article => article.id == articleId);
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
        let newCommentId = String(article.comments.length);
        let newCommentData = {
            "id": newCommentId,
            "date": today,
            "body": commentStr,
            "from": author.id
        }
        article.comments.push(newComment(newCommentData));
        synchronize(this.articles, this.articlePATH);
    }

    /**
    *Now the milestone has no id
    *However we need to add an id
    *later for better management
    *such as editing milestone or
    *editing the article contaned in
    *each milestone
    */
    this.addMilestoneToArticle = function(articleId, milestoneStr) {
        if (!this.hasArticle(articleId)) {
            throw "no such article";
        }
        let article = this.articles[Number(articleId)];
        let newMilestoneId = String(article.wishes.length);     
        article.wishes.push(today.split(' ')[0]+'\t'+milestoneStr);
        synchronize(this.articles, this.articlePATH);
    }

    this.getToday=function(choose){
        if(choose == 1)
            return today.split('/')[0];             //return Month
        else if(choose == 2)
            return today.split(' ')[0];             //return Month/Date
        else
            return today;                           //return Month/Date Day
            
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