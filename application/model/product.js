var mongoose = require("mongoose");

var productSchema = new mongoose.Schema({
  _id: String,
  ProductName: String,
  ProductPrice: Number,
  ProductCategoryId: String,
  ProductStock: Boolean,
  ProductImage: String,
  ProductUpdateDate: { type: Date, default: Date.now }
},{_id:false});

var product = mongoose.model('Product',productSchema);
module.exports = product;
