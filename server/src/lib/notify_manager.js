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
        await user.save();
        return notify._id;
    }
}