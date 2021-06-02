const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  honor: {
    type: String,
    enum: ['lv1', 'lv2', 'lv3', 'lv4', 'lv5', 'lv6', 'lv7', 'lv8'],
  },
  selfIntro: String,
  proPic: String,  // url to profile picture
  fans: [{ type: mongoose.Types.ObjectId, ref: 'User'}],
  followingUsers: [{ type: mongoose.Types.ObjectId, ref: 'User'}],
  followingPosts: [{ type: mongoose.Types.ObjectId, ref: 'Article'}],
  selfPosts: [{ type: mongoose.Types.ObjectId, ref: 'Article'}],
  finishedPosts: [{ type: mongoose.Types.ObjectId, ref: 'Article'}]
});

module.exports = mongoose.model('User', userSchema);