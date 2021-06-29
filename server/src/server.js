const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
var cors = require("cors");
const https_config = require('../https.config');
const port = https_config.port;
const https = require('https');
const db_config = require('../db.config');
const filePath = __dirname + '/data/uploads/';
const ip = require('ip');
const corsOptions = {
    origin : [
        "http://localhost:8080", "http://luffy.ee.ncku.edu.tw:5000",
        "https://luffy.ee.ncku.edu.tw:5000", "https://bhbbbbb.github.io"
    ],
    methods : "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders : [ "Content-Type", "Authorization" ],
    credentials : true
};

// if using luffy:
// const db_url =
// `mongodb+srv://${db_config.user}:${db_config.password}@${db_config.host}/${db_config.database}`

// if using Atlas:
// make sure that you have added your computer's ip to the DB's ip access list
// const db_url =
//     'mongodb://yuyu:isengineer@cluster0-shard-00-00.jhbg0.mongodb.net:27017,cluster0-shard-00-01.jhbg0.mongodb.net:27017,cluster0-shard-00-02.jhbg0.mongodb.net:27017/test?ssl=true&replicaSet=atlas-qfbkre-shard-0&authSource=admin&retryWrites=true&w=majority';
// const db_url =
//     'mongodb://yuyu:isengineer@cluster0-shard-00-00.jhbg0.mongodb.net:27017,cluster0-shard-00-01.jhbg0.mongodb.net:27017,cluster0-shard-00-02.jhbg0.mongodb.net:27017/alpha?ssl=true&replicaSet=atlas-qfbkre-shard-0&authSource=admin&retryWrites=true&w=majority';

const db_url = 
    `mongodb://${db_config.alpha.user}:${db_config.alpha.password}@${db_config.alpha.host}/${db_config.alpha.database}?${db_config.alpha.postfix}`;

const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
};

// do the shit only when db is connected
mongoose.connect(db_url, mongooseOptions)
    .then(() => {
        const app = express();
        app.use('/media', express.static(filePath));
        app.use(cors(corsOptions));
        // app.use(cors());

        app.use(express.urlencoded({extended : false}))
        app.use(express.json())

        var user = require('./router/user');
        var articles = require('./router/articles');
        var uploads = require('./router/upload');
        var search = require('./router/search');
        // setup router

        app.use('/user', user);
        app.use('/articles', articles);
        app.use('/uploads', uploads);
        app.use('/search', search);

        process.env.NODE_ENV =
            https_config.production ? 'production' : 'develop';

        if (https_config.https_enable) {
            const https_options = {
                ca : fs.readFileSync(https_config.ssl.ca),
                cert : fs.readFileSync(https_config.ssl.cert),
                key : fs.readFileSync(https_config.ssl.key),
            };
            https.createServer(https_options, app)
                .listen(port, () => {console.log(`listen on port:${port}`)})
        } else {
            app.listen(port, () => {
                console.log(`listening on port: ${port}, at ` + __dirname + ` on ${ip.address()}`);
            })
        }
    });
