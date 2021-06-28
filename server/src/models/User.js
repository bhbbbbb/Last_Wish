const mongoose = require("mongoose");
const Article = require("./Article");
const Notify = require("./Notify");

const mongoose_fuzzy_searching = require("mongoose-fuzzy-searching");
const colorValidator = (v) => {
  return (/^#([0-9a-fA-F]{3}){1,2}$/i).test(v);
}
const HONOR = ["honor1", "honor2", "honor3", "honor4", "honor5", "honor6", "honor7", "honor8"];

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
const selfnotifySchema = new mongoose.Schema({
  describe: String,
  link:{type: mongoose.Types.ObjectId, ref: 'Article'},
  checked:{
    type: Boolean,
    default: false
  }
})


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
  lv: {
    type: Number,
    default: 1
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
  notifies: [selfnotifySchema],
  lastSync:{
    type: Date,
  },
  score:{
    type: Number,
    default: 0,
  }
});

userSchema.method('getHonor', function() {
  return HONOR[this.lv - 1];
});

userSchema.method('changeScore', function(deltaScore) {
  if (deltaScore > 0) {
    this.score += deltaScore;
    let lv = getLevel(this.score);
    this.lv = (this.lv > lv)? this.lv : lv;    
  } else if (this.score >= -deltaScore) {
    // ths deltaScore is negative in this case
    // don't update level and make sure there is enough score to be minused
    this.score += deltaScore;
  } else {
    // the case should not occuar, but it's more safe this way
    this.score = 0;
  }
});

function getLevel(score) {
    let lv = 1;
    if (score>=5000)
        lv = 8;
    else if (score>=3000)
        lv = 7;
    else if (score>=2000)
        lv = 6;
    else if (score>=1000)
        lv = 5;
    else if (score>=600)
        lv = 4;
    else if (score>=300)
        lv = 3;
    else if (score>=100)
        lv = 2;
    return lv;
}

userSchema.plugin(mongoose_fuzzy_searching, { fields: ['username'] });
module.exports = mongoose.model('User', userSchema);