const fs = require("fs");
var d = new Date();
var month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
var today = month[d.getMonth()] + ' ' + String(d.getDate()) + ', ' + days[d.getDay()];

module.exports = function() {
    this.articlePATH = __dirname + "/../data/articles.json";
    this.articles = require(this.articlePATH);

    // the method has not finished
    // it should return the id of the new post
    // account manager can retrive the id from the method
    // and add it to its author
    this.insertArticle = function(post) {
        let newPostId = articles.length;
        let newPostData = {
            "id": newPostId,
            "from": author.id,
            "body": post.body,
            "title": post.title,
            "date": today,
            "wishes": post.wishes
        };

    }

    //TODO:
    // addCommentToPost
    // ...

}

function newArticle(newPostData) {
    let template = {
        "id": "",
        "from": "",
        "body": "",
        "title": "",
        "date": "",
        "wishes": [],
        "comments": []
    };
    for (keys in newPostData) {
        template[keys] = newPostData[keys];
    }
    return template;
}