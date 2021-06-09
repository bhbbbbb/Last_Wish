const express = require('express');
const mongoose = require('mongoose');
const app = express();
const fs = require('fs');
var cors = require("cors");
const port = 2222;
const https_config = require('../https.config');
const https = require('https');
const db_config = require('../db.config');

app.use('/media', express.static('./data/uploads/'));
const corsOptions = {
  origin: ["http://localhost:8080", "http://luffy.ee.ncku.edu.tw:5000", "https://luffy.ee.ncku.edu.tw:5000", "https://bhbbbbb.github.io"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

// if using luffy:
// const db_url = `mongodb+srv://${db_config.user}:${db_config.password}@${db_config.host}/${db_config.database}`

// if using Atlas:
// make sure that you have added your computer's ip to the DB's ip access list
const db_url = 'mongodb://yuyu:isengineer@cluster0-shard-00-00.jhbg0.mongodb.net:27017,cluster0-shard-00-01.jhbg0.mongodb.net:27017,cluster0-shard-00-02.jhbg0.mongodb.net:27017/test?ssl=true&replicaSet=atlas-qfbkre-shard-0&authSource=admin&retryWrites=true&w=majority';

// do the shit only when db is connected
mongoose.connect(db_url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  const app = express();
  app.use(cors(corsOptions));
  // app.use(cors());

  app.use(express.urlencoded({ extended: false }))
  app.use(express.json())

  var user = require('./router/user');
  var articles = require('./router/articles');
  var uploads = require('./router/upload');
  // setup router

  app.use('/articles', articles);
  app.use('/user', user);
  app.use('/uploads', uploads);

  process.env.NODE_ENV = https_config.production ? 'production' : 'develop';

  if (https_config.https_enable) {
    const https_options = {
      ca: fs.readFileSync(https_config.ssl.ca),
      cert: fs.readFileSync(https_config.ssl.cert),
      key: fs.readFileSync(https_config.ssl.key),
    }  
    https.createServer(https_options, app).listen(port,()=>{
      console.log(`listen on port:${port}`)
    })
  } else {
    app.listen(port, () => {
      console.log(`listening on port: ${port}, at ` + __dirname);
    })
  }
});

