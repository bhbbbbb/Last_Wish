const mongoose = require("mongoose");
const mongoose_fuzzy_searching = require("mongoose-fuzzy-searching");
const colorValidator = (v) => {
  return (/^#([0-9a-fA-F]{3}){1,2}$/i).test(v);
}
const HONOR = ["魔法師學徒", "見習魔法士", "上級魔法士", "見習魔導士", "上級魔導士", "見習魔導師", "上級魔導師", "終極魔導師"];

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
  score: {
    type: Number,
    default: 0,
  },
  lv: {
    type: Number,
    default: 1
  },
  selfIntro: {
    type: String,
    default: '這就是我的自介',
  },
  proPic: {
    type: String,  // url to profile picture
    default: "",
  },
  followedPosts: [{ type: mongoose.Types.ObjectId, ref: 'Article'}],
  likedPosts: [{ type: mongoose.Types.ObjectId, ref: 'Article' }],
  selfPosts: [{ type: mongoose.Types.ObjectId, ref: 'Article'}],
  events: [eventSchema],
  nFinishedPosts: {
    type: Number,
    default: 0
  },
  citedCount: {
    type: Number,
    default: 0,
  },
  likedCount: {
    type: Number,
    default: 0,
  },
  notifies: [{ type: mongoose.Types.ObjectId, ref: 'Notify'}],
  stashedNotifies: [{ type: mongoose.Types.ObjectId, ref: 'Notify'}],
  unread:{
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

userSchema.method('getPublicInfo', function() {
  return {
    id: this._id,
    username: this.username,
    pro_pic: this.proPic,
  };
});

userSchema.method('getHomePageInfo', function() {
  return {
    // TODO: return the data for progress bar
    id: this._id,
    username: this.username,
    pro_pic: this.proPic,
    self_intro: this.selfIntro,
    lv: this.lv,
    score: this.score,
    honor: this.getHonor(),
    n_posts: this.selfPosts.length,
    n_finished: this.nFinishedPosts,
    n_cited: this.citedCount,
    n_liked: this.likedCount,
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