var mongoose = require("mongoose");

var cartSchema = new mongoose.Schema({
  user_id: String,
  product_id: String,
  product_name: String,
  quantity: Number,
  product_price: Number,
  product_image: String
});

var cart = mongoose.model('Cart',cartSchema);
module.exports = cart;
