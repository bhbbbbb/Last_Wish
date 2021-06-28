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
    let notify = new Notify({
      from: from,
      to: to,
      link: link,
      actions: action,
    })
    await notify.save();
  }
  
  this.addNotifyWithoutTo = async function(from, link, action){
    let article = await Article.findById(link);
    if(!article)
      return;
    let = to = article.author;
    if(!from || !to)
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
    //This is used for old data
    //if(!time)
      time = new Date('July 1, 1999');

    let selfNotify = await Notify.find({"to": userId}).exec();
    let followNotify = [];
    if(user.followedPosts){
      let len = user.followedPosts.length;
      if(len > 0){
        for(i = 0;i < len;i++){
          followNotify.push(await Notify.find({"link": user.followedPosts[i]}));
        }
      }
    }
    if(selfNotify.length > 0){
      let selfLen = selfNotify.length;
      for(i = selfLen-1; i >= 0; i--){
        obj = selfNotify[i];
        if(obj.date > time){
          if(obj.from != obj.to)
            await selfNotifyParse(obj);
        }
        else
          break;
      }
    }
    let followLen = followNotify.length;
    if(followLen > 0){
      for(i = followLen - 1; i >= 0; i--){
        let notifyCollection = followNotify[i];
        let notifyCollectionLen = notifyCollection.length;
        if(notifyCollectionLen > 0)
        for(j = notifyCollectionLen-1;j >= 0 ;j--){
          let obj = notifyCollection[j];
          if(obj.date > time){
            if(obj.to != userId)
              await followNotifyParse(obj, userId);
            }
          else
            break;
        }
      }
    }
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
      users = [...new Set(users)];  //Use set to wipe out duplicated user
                                    //a = ['a','a','b','c']; 
                                    //[...new Set(a)] = ['a','b','c'];
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
  if(from == to)
    return;
  article = await articleManager.getArticleById(obj.link);
  let describes = '';
  switch(obj.actions){
    case 'Tag':
      describes = from.username + '在文章' + article.title + '標註了你' ;
      break;
    case'Comment':
      describes = from.username + '在你的文章' + article.title + '底下留言' ;
      break;
    //case 'Followed':
    //  describes = from.username + '追蹤了你的文章 ' + article.title ; //追蹤文章會有反覆追蹤的問題，暫時保留
    //  break;
    //case 'Liked': 
    //  describes = from.username + '喜歡你的文章 ' + article.title ;   //Liked文章會有反覆like的問題，暫時保留
    //  break; 
    case 'Quote':
      describes = from.username + '引用了你的文章' + article.title ;
      break;
    default:
      break;
  }
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
  if(obj.from == userId)
    return; 
  from = await User.findById(obj.from);
  user = await User.findById(userId);
  article = articleManager.getArticleById(obj.link);
  let describes = '';
  switch(obj.actions){
    case'Comment':
      describes = from.username + '在你追蹤的文章' + article.title + '底下留言' ;
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
    user.notifies.push(newNotify);
    await user.save();
  }
}
