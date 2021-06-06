const mongoose = require("mongoose");
const User = require("./User");

const commentSchema = new mongoose.Schema({
  body: String, author: { type: mongoose.Types.ObjectId, ref: 'User' },
  date: {
    type: Date,
    default: Date.now
  },
  likes: {
    type: Number,
    default: 0,
  },
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
  citing: String,
  author: { type: mongoose.Types.ObjectId, ref: 'User' },
  tags: [String],
  finished: {
    type: Boolean,
    default: false
  },
  finishedMilestones: [milestoneSchema],
  undoneMilestones: [milestoneSchema],
  likes: {
    type: Number,
    default: 0,
  },
  comments: [commentSchema],
  fans: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('Article', articleSchema);