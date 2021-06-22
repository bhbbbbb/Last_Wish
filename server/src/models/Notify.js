const mongoose = require("mongoose");



const notifySchema = new mongoose.Schema({
  from: {type: mongoose.Types.ObjectId},
  to: {type: mongoose.Types.ObjectId},
  Actions: {
    type: String,
    enum:['Post','Comment','Followed','Liked'],
  },
  date: {
    type: Date,
    default: Date.now
  },
});