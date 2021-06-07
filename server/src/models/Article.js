const mongoose = require("mongoose");

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
  // replys: [commentSchema],
})

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
  citeFrom: { type: mongoose.Types.ObjectId, ref: 'User' },
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
});

module.exports = mongoose.model('Article', articleSchema);