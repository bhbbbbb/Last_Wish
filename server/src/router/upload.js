var express = require('express');
var uploads = express.Router();

//File upload part
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './data/uploads');
    },
    filename: function (req, file, callback) {
        var fileFormat = (file.originalname).split(".");
        callback(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
    //The file.originalname can be change to any string you want.
    //While if you want to change to other name, you need to append Filename Extension, too.
    }
});

const upload = multer({ storage: storage }); 

uploads.post('/uploadFile', upload.single('avatar'),async (req, res, next) => {
    if(req.file)
        res.send({res:'success'});
});

//File upload part

module.exports =  uploads;