const express = require('express')
var fs = require("fs");
// create an express, aka web server, instance

const app = express()
var cors = require("cors");
const port = 2222;
// const corsOptions = {
//   origin: ["http://localhost:8080"],
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
//   allowedHeaders: ["Content-Type", "Authorization"],
// };

// app.use(cors(corsOptions));
app.use(cors());
// start the server

app.listen(port, () => {
  console.log(`listening on port: ${port}, at ` + __dirname);
})


// include `body-parser`
const bodyParser = require('body-parser')

// setup `body-parser`
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())



// app.use(express.static(__dirname + "/data"));

const articlePATH = __dirname + "/data/articles.json";
var articles = require(articlePATH);


app.post('/articles/insert', (req, res) => {
  articles.push(req.body);
  let str = JSON.stringify(articles);
  res.send(str)
  fs.writeFile(articlePATH, str, (err) => {
    if(err) console.log(err);
  });
})



app.get('/articles', (req, res) => {
  res.send(JSON.stringify(articles));
});

