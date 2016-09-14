var Cart = require('../model/cart');
var Category = require('../model/category');
var Product = require('../model/product');
exports.Index = function(req,res,next){
  Cart.find({user_id:"user_id"},function(err,carts){
    Category.find({},function(err,categories){
      res.render('cart',{'title':'Cart','categories':categories,'carts':carts});
    });
  });
}

exports.Add = function(req,res){
  var product_id = req.params.product_id;
  var type = req.params.type;
  if (typeof type === 'undefined'){
    Cart.findOne({product_id:product_id,user_id:"user_id"},function(err,cart){
      if(cart){
        res.redirect('/cart');
        return;
      }
      else{
        Product.findOne({_id:product_id},function(err,product){
          if (err)
            throw err;
          var cart = new Cart({
            user_id: "user_id",
            product_id: product._id,
            product_name: product.ProductName,
            quantity: 1,
            product_price: product.ProductPrice,
            product_image: product.ProductImage
          });
          cart.save(function(err){
            if(err)
              throw err;
            res.redirect('/cart');
          })
        });
      }
    });
  }
  else {
    Cart.findOne({product_id:product_id,user_id:"user_id"},function(err,cart){
      var quantity;
      if(type=='plus')
        quantity=cart.quantity+1;
      if(type=='sub'){
        if(cart.quantity==1){
          res.redirect('/cart');
          return;
        }
        else
          quantity=cart.quantity-1;
      }
      if(type=='form')
      {
        quantity=req.query.quantity;
      }
      Cart.update({product_id:product_id,user_id:"user_id"},{ $set: { quantity: quantity }},function(err,updated){
        if(err)
          throw err;
        res.redirect('/cart');
      });
    });
  }
}

exports.Remove = function(req,res){
  var product_id = req.params.product_id;
  Cart.remove({product_id:product_id,user_id:"user_id"},function(err){
    if(err)
      console.log(err);
    res.redirect('/cart');
  });
}
