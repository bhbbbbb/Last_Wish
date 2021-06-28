const mongoose = require("mongoose");

const notifySchema = new mongoose.Schema({
  from: { type: mongoose.Types.ObjectId, ref: 'User' },
  to: { type: mongoose.Types.ObjectId, ref: 'User' },
  link: { type: mongoose.Types.ObjectId, ref: 'Article' },
  content: String,  // reserved for extra content such as comment string, may be unnecessary
  action: {
    type: String,
    enum: [
      'TagInPost',
      'TagInComment',
      'CommentOnSelf',
      'CommentOnFollowed',
      'UpdateOnFollowed',
      'Liked',
      'Quote'
    ],
    date: {
      type: Date,
      default: Date.now,
    },
    checked: {
      type: Boolean,
      default: false
    },
    delete: {
      type: Boolean,
      default: false,
    },
  }
});

notifySchema.method('getDescription', function() {  // refer to parse
  console.log(this.from.username);
  switch (this.action) {
    case 'TagInPost':
      return `${this.from.username}在文章 '${this.link.title}' 標註了你`
    case 'TagInComment':
      return `${this.from.username}在一則留言中標註了你`
    case 'CommentOnSelf':
      return `${this.from.username}在你的文章 '${this.link.title}' 底下留言`
    case 'CommentOnFollowed':
      return `${this.from.username}在你追蹤的文章 '${this.link.title}' 底下留言`
    case 'UpdateOnFollowed':
      return `${this.from.username}更新了你追蹤的文章 '${this.link.title}'`
    case 'Liked':
      return `${this.from.username}喜歡你的文章 '${this.link.title}'`
    case 'Quote':
      return `${this.from.username}引用了你的文章 '${this.link.title}'`
  }
});

notifySchema.method('toFrontendFormat', function() {
  return {
    description: this.getDescription(),
    linek: this.link,
    checked: this.checked
  };
});

module.exports = mongoose.model('Notify', notifySchema);