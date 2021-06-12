const mongoose = require("mongoose");
const Article = require("./Article");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  verified:{
    type: Boolean,
    default: false
  },
  honor: {
    type: String,
    enum: ['lv1', 'lv2', 'lv3', 'lv4', 'lv5', 'lv6', 'lv7', 'lv8'],
    default: 'lv1',
  },
  selfIntro: {
    type: String,
    default: 'The user don\'t have a self intro',
  },
  proPic: {
    type: String,  // url to profile picture
    default: "",
  },
  fans: [{ type: mongoose.Types.ObjectId, ref: 'User'}],
  followedUsers: [{ type: mongoose.Types.ObjectId, ref: 'User'}],
  followedPosts: [{ type: mongoose.Types.ObjectId, ref: 'Article'}],
  likedPosts: [{ type: mongoose.Types.ObjectId, ref: 'Article' }],
  selfPosts: [{ type: mongoose.Types.ObjectId, ref: 'Article'}],
  finishedPosts: [{ type: mongoose.Types.ObjectId, ref: 'Article'}]
});

userSchema.post('remove', (user) => {
  console.log("deleting", user.username);
  for (articleId of user.selfPosts) {
    Article.findByIdAndRemove(articleId);
  }
});

module.exports = mongoose.model('User', userSchema);