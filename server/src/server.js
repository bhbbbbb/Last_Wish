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
const user_listPATH = __dirname + "/data/user_list.json";
const accountsPATH = __dirname + "/data/accounts.json";
var articles = require(articlePATH);
var user_list = require(user_listPATH);
var accounts_info = require(accountsPATH);

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

// 20 = OK
// 405 = Method Not Allow
app.post('/user/try_login', (req, res) => {
  let response = {
    state: undefined,
    err_msg: "",
  };
  if (!(req.body.username in user_list)) {
    response.state = 405;
    response.err_msg = "user not found";
    res.send(JSON.stringify(response));
    return;
  }
  let user_id = Number(user_list[req.body.username]);
  if (accounts_info[user_id].password != req.body.password) {
    response.state = 405;
    response.err_msg = "password not matched";
    res.send(JSON.stringify(response));
    return;
  }

  response.state = 20;
  res.send(JSON.stringify(response));
  return;
});