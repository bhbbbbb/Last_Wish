const express = require('express')
// create an express, aka web server, instance


const app = express()
var cors = require("cors");
const port = 2222;
// const corsOptions = {
//   origin: ["http://localhost:8080"],
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
//   allowedHeaders: ["Content-Type", "Authorization"],
// };

const baseURL = 'http://localhost:2222';


// app.use(cors(corsOptions));
app.use(cors());
// start the server

app.listen(port, () => {
  console.log(`listening on port: ${port}, at ` + __dirname);
})

app.use(express.urlencoded({ extended: false }))
app.use(express.json())


var user = require('./router/user');
var articles = require('./router/articles');

// setup router
app.use('/articles', articles);
app.use('./router/user', user);