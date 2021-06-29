const Notify = require('../models/Notify');
const User = require('../models/User')
module.exports = function() {
    /**
     * 
     * @param {String} from 
     * @param {String} to 
     * @param {String} link 
     * @param {String} action 
     * @returns 
     */
    // this method will create a notify object and return its id
    // one can retrieve the id by this method and push it to relevant user (e.g., the "to")
    this.createNotify = async function(from, to, link, action) {
        if (!from || !to) return null;
        if (from == to) return null;
        let notifyData = {
            from: from,
            to: to,
            link: link,
            action: action
        };
        let notify = new Notify(notifyData);
        await notify.save();
        let user = await User.findById(to);
        if(!user)
          return;
        user.stashedNotifies.push(notify._id);
        user.unread = user.unread + 1;
        await user.save();
        return notify._id;
    }

    this.checkNotify = async function(userId, notifyId, set){
        let notify = await Notify.findById(notifyId).populate('to');
        if(!notify)        
            throw "notify not found"
        console.log(notify.to);
        if(notify.to._id != userId)
            throw "not the user!"
        if(set != notify.checked){
            if(set)
                notify.to.unread = notify.to.unread - 1;
            else
                notify.to.unread = notify.to.unread + 1;
            }
        notify.checked = set;
        await notify.save();
    }

    this.deleteNotify = async function(userId, notifyId, set){
        let notify = await Notify.findById(notifyId);
        if(!notify)
            throw "notify not found"
        if(notify.to != userId)
            throw "not the user!"
        notify.deleted = set;
        await notify.save();
    }
}