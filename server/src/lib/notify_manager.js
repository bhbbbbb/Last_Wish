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
    if(!from || !to)
      return;
    if(from == to)
      return;
    let notify = new Notify({
      from: from,
      to: to,
      link: link,
      actions: action,
    })
    await notify.save();
  }
  

  //This havan't been tested yet
  this.extrcatNotify = async function(userId){
    let user = await User.findById(userId);
    if(!user)
      throw "user not found"
    let time = user.lastSync;
    if(!time)
      time = new Date('July 1, 1999');
    let selfNotify = await Notify.find({"to": userId}).exec();
    let followNotify = [];
    if(user.followedPosts){
      user.followedPosts.forEach(async (articleId) => {
        followNotify.push(await Notify.find({"link": articleId}).exec());
      })
    }
    selfNotify.forEach(async obj => {
      if(obj.date > time)
        await selfNotifyParse(obj);
    })
    followNotify.forEach(notifyCollection => {
      notifyCollection.forEach(async obj => {
        if(obj.date > time && obj.to != userId)
          await followNotifyParse(obj);
      })
    })
    user.lastSync = Date.now();
    await user.save();
  }

  this.addTagevent = async function(from, stringToBeParse, articleId){
    let users = [];
    const pattern = /(?:\s|^)@(\w+)/;
    while (stringToBeParse) {
      let found = stringToBeParse.match(pattern);
      if (!found) break;
      let plain_text = stringToBeParse.substring(0, found.index);
      stringToBeParse = stringToBeParse.substring(found.index + found[0].length);
      users.push(found[1]);
    }
    if(users){
      users = [...new Set(users)];
    }
    users.forEach(async (user) => {
      let userObj = await accountManager.findUserbyUsername(user);
      if(userObj)
        this.addNotify(from, userObj._id, articleId, 'Tag');
    })
  }
}

async function selfNotifyParse(obj){
  from = await User.findById(obj.from);
  to = await User.findById(obj.to);
  if(!from || !to)
    return;
  article = await articleManager.getArticleById(obj.link);
  let describes = '';
  switch(obj.actions){
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
  console.log(describes);

  if(describes){
    let newNotify = {
      describe: describes,
      link: obj.link,
      checked: false,
    }
    to.notifies.push(newNotify);
    await to.save();
  }
}

async function followNotifyParse(obj, userId){
  from = await User.findById(obj.from);
  user = await User.findById(userId);
  article = articleManager.getArticleById(obj.link);
  let describes = '';
  switch(obj.actions){
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
    user.notifies.push(newNotify);
  }
}
