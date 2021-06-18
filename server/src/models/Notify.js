const mongoose = require("mongoose");

const typeValidator = (t) => {
    valid_type = ['Post','Comment','Followed','Liked'];
    return (t in valid_type);
}

const notifySchema = new mongoose.Schema({
  from: {type: mongoose.Types.ObjectId},
  to: {type: mongoose.Types.ObjectId},
  Actions: {
    type: String,
    validate: typeValidator,
  },
  date: {
    type: Date,
    default: Date.now
  },
});