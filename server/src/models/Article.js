const mongoose = require("mongoose");
const mongoose_fuzzy_searching = require("mongoose-fuzzy-searching");

const commentSchema = new mongoose.Schema({
  body: String, 
  author: { type: mongoose.Types.ObjectId, ref: 'User' },
  date: {
    type: Date,
    default: Date.now
  },
  likes: {
    type: Number,
    default: 0,
  },
});

const milestoneSchema = new mongoose.Schema({
  title: String,
  body: String,
  estDate: Date,
  finished: {
    type: Boolean,
    default: false,
  },
});

const articleSchema = new mongoose.Schema({
  title: String,
  body: String,
  date: {
    type: Date,
    default: Date.now
  },
  citation: { type: mongoose.Types.ObjectId, ref: 'Article' },
  author: { type: mongoose.Types.ObjectId, ref: 'User' },
  tags: [String],
  finished: {
    type: Boolean,
    default: false
  },
  milestones: [milestoneSchema],
  likes: {
    type: Number,
    default: 0,
  },
  citedCount: {
    type: Number,
    default: 0,
  },
  comments: [commentSchema],
  fans: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
  visited:{
    type: Number,
    default : 0,
  }
});

// this is not stable maybe need revising
articleSchema.method('sortMilestonesAndSave', async function() {
  this.milestones.sort((m, n) => {
    if (m.finished == n.finished) {
      return m.estDate - n.estDate;
    } else {
      return n.finished - m.finished;
    }
  })
  await this.save();
});

articleSchema.method('toFrontendFormat', function() {
  return {
    id: this._id,
    author: {
      id: this.author._id,
      name: this.author.username,
      pro_pic: this.author.proPic,
    },
    content: {
      tags: this.tags,
      title: this.title,
      body: this.body,
      milestones: this.milestones,
    },
    finished: this.finished,
    date: this.date,
    citation: this.citation,
    cited_count: this.citedCount,
    likes: this.likes,
    comments: this.comments,
    fans: this.fans
  }
});

articleSchema.plugin(mongoose_fuzzy_searching, { fields: ['title'] });
module.exports = mongoose.model('Article', articleSchema);