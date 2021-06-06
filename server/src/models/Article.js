const mongoose = require("mongoose");
const User = require("./User");

const commentSchema = new mongoose.Schema({
  body: String, author: { type: mongoose.Types.ObjectId, ref: 'User' },
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
  author: { type: mongoose.Types.ObjectId, ref: 'User' },
  tags: [String],
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