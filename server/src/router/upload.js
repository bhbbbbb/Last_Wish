var express = require('express');
var uploads = express.Router();
const FilePath = __dirname + '/../data/uploads';
function genNonce(length) {
    let result = [];
    let characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result.push(
            characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return result.join('');
}

// File upload part
var multer = require('multer');
var storage = multer.diskStorage({
    destination : function(req, file, callback) { callback(null, FilePath); },
    filename : function(req, file, callback) {
        console.log(file);
        callback(
            null,
            Date.now() + genNonce(Date.now() % 6) +
                ".jpg"); // The file.originalname can be change to any string
                         // you want. While if you want to change to other name,
                         // you need to append Filename Extension, too.
    }
});

const upload = multer({storage : storage}).single('file');

uploads.post('/uploadFile',
             async (req, res) => {upload(req, res, function(err) {
                 if (err) {
                     console.log(err)
                 } else {
                     var FileName = req.file.filename;
                     res.status(200).send(FileName);
                 }
             })});

// File upload part

module.exports = uploads;