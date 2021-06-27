const mongoose = require("mongoose");



const notifySchema = new mongoose.Schema({
  from: {
    name: String,
    id: {type: mongoose.Types.ObjectId}
  },
  to: {
    name: String,
    id: {type: mongoose.Types.ObjectId}
  },
  Link:{type: mongoose.Types.ObjectId, ref: 'Article'},
  Actions: {
    type: String,
    enum:['Tag','Comment','Followed','Liked','Quote'],
  },
  date: {
    type: Date,
    default: Date.now
  },
});
module.exports = mongoose.model('Notify', notifySchema);