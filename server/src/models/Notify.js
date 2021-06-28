const mongoose = require("mongoose");



const notifySchema = new mongoose.Schema({
  from: {
    id: {type: mongoose.Types.ObjectId}
  },
  to: {
    id: {type: mongoose.Types.ObjectId}
  },
  link:{type: mongoose.Types.ObjectId, ref: 'Article'},
  actions: {
    type: String,
    enum:['Tag','Comment','Followed','Liked','Quote'],
  },
  date: {
    type: Date,
    default: Date.now
  },
  delete:{
    type: Boolean,
    default:false,
  }
});
module.exports = mongoose.model('Notify', notifySchema);