const mongoose = require("mogoose");

const userSchema = new mongoose.Schema({
  username: String,
  honor: {
    type: String,
    enum: ['lv1', 'lv2', 'lv3', 'lv4', 'lv5', 'lv6', 'lv7', 'lv8'],
  },
  selfIntro: String,
  proPic: String,  // url to profile picture
  fans: [{ type: mongoose.Type.ObjectId, ref: 'User'}],
  followingUsers: [{ type: mongoose.Type.ObjectId, ref: 'User'}],
  followingPosts: [{ type: mongoose.Type.ObjectId, ref: 'Article'}],
  selfPosts: [{ type: mongoose.Type.ObjectId, ref: 'Article'}],
  finishedPosts: [{ type: mongoose.Type.ObjectId, ref: 'Article'}]
});

module.exports = mongoose.model('User', userSchema);