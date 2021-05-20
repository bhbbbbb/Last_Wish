const fs = require("fs");

let articles = require('./articles.json');

articles.forEach(article => {
    // console.log(article);
    // article.wishes.forEach(wish => {
    //     if (typeof(wish) === 'string')
    //         console.log(wish.split('\t'));
    // })

    for (let i = 0; i < article.wishes.length; i++)
        if (typeof(article.wishes[i]) === 'string') {
            let tem = article.wishes[i].split('\t');
            article.wishes[i] = {
                "time": tem[0],
                "title": tem[1],
            }
        }
});

fs.writeFile('./new_articles.json', JSON.stringify(articles), (err) => {
    console.log(err);
});