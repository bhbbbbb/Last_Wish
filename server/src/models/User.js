const mongoose = require("mongoose");
const mongoose_fuzzy_searching = require("mongoose-fuzzy-searching");
const colorValidator = (v) => {
  return (/^#([0-9a-fA-F]{3}){1,2}$/i).test(v);
}

const eventSchema = new mongoose.Schema({
  name: String,
  color: { 
    type: String,
    validate: colorValidator
  },
  start: Date,
  end: Date,
  finished: Boolean
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  nonce: {
    type: String,
    default : ""
  },
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
  finishedPosts: [{ type: mongoose.Types.ObjectId, ref: 'Article'}],
  events: [eventSchema],
});

userSchema.plugin(mongoose_fuzzy_searching, { fields: ['username'] });
module.exports = mongoose.model('User', userSchema);