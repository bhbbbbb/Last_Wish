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
    ]
  },
    date: {
      type: Date,
      default: Date.now,
    },
    checked: {
      type: Boolean,
      default: false
    },
    deleted: {
      type: Boolean,
      default: false,
    },
});

notifySchema.method('getDescription', function() {  // refer to parse
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
  if(!this.deleted && this.link)
    return {
      description: this.getDescription(),
      link: this.link._id,
      checked: this.checked,
      id: this._id,
      date: this.date,
    };
});

module.exports = mongoose.model('Notify', notifySchema);