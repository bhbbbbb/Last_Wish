const mongoose = require("mogoose");

const commentSchema = new mongoose.Schema({
  body: String,
  author: { type: mongoose.Type.ObjectId, ref: 'User' },
  likes: Number,
})

const milestoneSchema = new mongoose.Schema({
  title: String,
  body: String,
  finishedDate: Date,
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
  author: { type: mongoose.Type.ObjectId, ref: 'User' },
  tags: String,
  finishedMilestones: [milestoneSchema],
  undoneMilestones: [milestoneSchema],
  likes: {
    type: Number,
    default: 0,
  },
  comments: [commentSchema],
  fans: [{ type: mongoose.Type.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('Article', articleSchema);