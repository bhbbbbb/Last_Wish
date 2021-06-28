const mongoose = require("mongoose");

const notifySchema = new mongoose.Schema({
});

module.exports = mongoose.model('Notify', notifySchema);