const User = require('../models/User');
const Notify = require('../models/Notify');
const Article = require('../models/Article');
var AccountManager = require('./account_manager');
var accountManager = new AccountManager();
var ArticleManager = require('./article_manager');
var articleManager = new ArticleManager();
module.exports = function() {
  /**
   * 
   * @param {String} from(user_id) 
   * @param {String} to(user_id)
   * @param {String} link(article_id)
   * @param {String} action
   */
  this.addNotify = async function(from, to, link, action){
    let notify = new Notify({
      from: from,
      to: to,
      link: link,
      action: action,
    })
    await notify.save();
  }
  

//This havan't been tested yet
  this.extrcatNotify = async function(userId){
    let user = User.findById(userId);
    if(!user)
      throw "user not found"
    let time = user.lastSync;
    if(!time)
      time = new Date('July 1, 1999');
    let selfNotify = await Notify.find({"to": userId});
    let followNotify = []
    for(articleId in user.followedPosts)
      followNotify.push(await Notify.find({"link": articleId}));

    for(obj in selfNotify){
      if(obj.date > time)
        selfNotifyParse(obj);
    }
    for(obj in followNotify)
      if(obj.date > time && obj.to != userId)
        followNotifyParse(obj);
  }


}

async function selfNotifyParse(obj){
  from = await User.fundById(obj.from);
  to = await User.fundById(obj.to);
  article = articleManager.getArticleById(obj.link);
  let describes = '';
  switch(obj.action){
    case 'Tag':
      describes = from.username + '在文章 ' + article.title + '標註了你' ;
      break;
    case'Comment':
      describes = from.username + '在你的文章 ' + article.title + '底下留言' ;
      break;
    //case 'Followed':
    //  describes = from.username + '追蹤了你的文章 ' + article.title ; //追蹤文章會有反覆追蹤的問題，暫時保留
    //  break;
    //case 'Liked': 
    //  describes = from.username + '喜歡你的文章 ' + article.title ;   //Liked文章會有反覆like的問題，暫時保留
    //  break; 
    case 'Quote':
      describes = from.username + '引用了你的文章 ' + article.title ;
      break;
    default:
      break;
  }
  if(describe){
    let newNotify = {
      describe: describes,
      link: obj.link,
      checked: false,
    }
    to.Notifies.push(newNotify);
  }
}

async function followNotifyParse(obj, userId){
  from = await User.fundById(obj.from);
  user = await User.fundById(userId);
  article = articleManager.getArticleById(obj.link);
  let describes = '';
  switch(obj.action){
    case'Comment':
      describes = from.username + '在你追蹤的文章 ' + article.title + '底下留言' ;
      break;
    default:
      break;
  }
  if(describe){
    let newNotify = {
      describe: describes,
      link: obj.link,
      checked: false,
    }
    user.Notifies.push(newNotify);
  }
}