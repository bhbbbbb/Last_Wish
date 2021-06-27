const mongoose = require("mongoose");
const mongoose_fuzzy_searching = require("mongoose-fuzzy-searching");

const tagSchema = new mongoose.Schema({
  name: String,
  related: [{ type: mongoose.Types.ObjectId, ref: 'Article' }],
});

tagSchema.plugin(mongoose_fuzzy_searching, { fields: ['name'] });
module.exports = mongoose.model('Tag', tagSchema);