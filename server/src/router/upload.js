var express = require('express');
var uploads = express.Router();

//File upload part
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './data/uploads');
    },
    filename: function (req, file, callback) {
        console.log(file);
        callback(null, file.originalname);          //The file.originalname can be change to any string you want.
                                                    //While if you want to change to other name, you need to append Filename Extension, too.
    }
});

const upload = multer({ storage: storage }).single('file'); 

uploads.post('/uploadFile', async (req, res) => {
    upload(req, res, function (err) {
        if (err) {
            console.log(err)
        } else {
            var FileName = req.file.filename;
            res.status(200).send(FileName);
        }
    })
});

//File upload part

module.exports =  uploads;