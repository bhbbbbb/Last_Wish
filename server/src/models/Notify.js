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
      return `在文章 '${this.link.title}' 標註了你`
    case 'TagInComment':
      return `在一則留言中標註了你`
    case 'CommentOnSelf':
      return `在你的文章 '${this.link.title}' 底下留言`
    case 'CommentOnFollowed':
      return `在你追蹤的文章 '${this.link.title}' 底下留言`
    case 'UpdateOnFollowed':
      return `更新了你追蹤的文章 '${this.link.title}'`
    case 'Liked':
      return `喜歡你的文章 '${this.link.title}'`
    case 'Quote':
      return `引用了你的文章 '${this.link.title}'`
  }
});

notifySchema.method('toFrontendFormat', function() {
  if(!this.deleted && this.link)
    return {
      description: this.getDescription(),
      from: {
        id: this.from._id,
        name: this.from.username,
        pro_pic: this.from.proPic,
      },
      link: this.link._id,
      checked: this.checked,
      id: this._id,
      date: this.date,
    };
});

module.exports = mongoose.model('Notify', notifySchema);