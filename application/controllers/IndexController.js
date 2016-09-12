var Category = require('../model/category');
var Product = require('../model/product');

exports.Index = function(req,res,next){
  Category.find({},function(err,categories){
    if(err)
      console.log(err);
    res.render('index',{title: 'Home',categories:categories});
  });
}


exports.Product = function(req,res){
  var category;
  var product;
  var CategoryPromise = new Promise(function(resolve, reject){
    Category.find({},function(err,categories){
      if (err)
        reject(err);
      resolve(categories);
    });
  });
  var ProductPromise = new Promise(function(resolve, reject){
    Product.find({},function(err,products){
      if (err)
        reject(err);
      resolve(products);
    });
  });
  //Promise chaining
  CategoryPromise.then(function(categories){
    category = categories;
    return ProductPromise;
  }).then(function(products){
    product = products;
    res.render('shop',{title:'Shop',categories:category,products:product});
  })

  //Promise bất đồng bộ
  /*Promise.all([CategoryPromise,ProductPromise])
  .then(function(result){
    console.log(result);
  })*/
}
