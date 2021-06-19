var express = require('express');
var uploads = express.Router();
const FilePath = __dirname + '/../data/uploads';
var user_session = require('../lib/session.js');
const account_manager = require("../lib/account_manager");
const accountManager = new account_manager();
var fs = require('fs');

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

async function deleteFile(filename){
    let path = FilePath + '/' + filename.split('/media/')[1];
    if(!filename){
        console.log('No_old_pic');
        return;
    }
    try {
        await fs.unlink(path, function (err) {});
    } catch (error) {
        console.log(error);
        return; // do nothing if err occur;
    }
}

// File upload part
var multer = require('multer');
var storage = multer.diskStorage({
    destination : function(req, file, callback) { callback(null, FilePath); },
    filename : function(req, file, callback) {
        //console.log(file);
        callback(
            null,
            Date.now() + genNonce(Date.now() % 6 + 5) +
                ".jpg"); // The file.originalname can be change to any string
                         // you want. While if you want to change to other name,
                         // you need to append Filename Extension, too.
    }
});

const upload = multer({storage : storage}).single('file');

uploads.post('/uploadFile', user_session, async (req, res) => 
{
    let userId = req.session.user_id;
    try {
        let user = await accountManager.getUserInfo(userId);
        if(user)
            await deleteFile(user.proPic);
        upload(req, res, function(err) {
            if (err) {
                console.log(err)
                } else {
                    var FileName = req.file.filename;
                    res.status(200).send(FileName);
                }
        })
    } catch (error) {
        res.status(400).json('user not found');
    }
});

// File upload part

module.exports = uploads;