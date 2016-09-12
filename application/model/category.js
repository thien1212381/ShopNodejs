var mongoose = require("mongoose");

var categorySchema = new mongoose.Schema({
  _id: String,
  name: String,
  sub: [String]
},{_id:false});

var category = mongoose.model('Category',categorySchema);
module.exports = category;
