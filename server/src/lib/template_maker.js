var templateMaker = function(object) {
    return function(context) {
        var replacer = function(key, val) {
            if (typeof val === 'function') {
                return context[val()]
            }
            return val;
        }
        return JSON.parse(JSON.stringify(object, replacer));
    }
}

module.exports = {
    templateMaker
}