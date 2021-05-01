const express = require('express')
const app = express()
var cors = require("cors");
const port = 2222;
const corsOptions = {
  origin: ["http://localhost:8080", "http://127.0.0.1:8080"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

app.use(cors(corsOptions));
// app.use(cors());

app.use(express.urlencoded({ extended: false }))
app.use(express.json())


var user = require('./router/user');
var articles = require('./router/articles');
// setup router

app.use('/articles', articles);
app.use('/user', user);



app.listen(port, () => {
  console.log(`listening on port: ${port}, at ` + __dirname);
})