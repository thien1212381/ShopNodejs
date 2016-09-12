var Category = require('../model/category');

exports.Index = function(req,res,next){
  Category.find({},function(err,categories){
    if(err)
      console.log(err);
    res.render('index',{title: 'Home',categories:categories});
  });
}
