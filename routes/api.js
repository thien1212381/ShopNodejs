var express = require('express');
var router = express.Router();
var Product = require('../application/model/product');
var User = require('../application/model/user');
var Category = require('../application/model/category');
var jwt    = require('jsonwebtoken');
var async = require('async');


router.route('/authenticate')
      .post(function(req,res){

        var username = req.body.username;
        var password = req.body.password;

        User.findOne({username: username},function(err,user){
          if(err){

            res.json({
              success: false,
              message: 'Authentication failed. Username and password was wrong.'
            })

            return;
          }
          else {

            if(user.validPassword(password)){
              var token = jwt.sign({username:username}, '@secrect@token', {
                algorithm: 'HS256',
                expiresIn: '1h' // expires in 24 hours
              });

              // return the information including token as JSON
              res.json({
                success: true,
                message: 'Here is your token!',
                token: token
              });
            }

          }
        });
      });

router.use(function(req, res, next) {
      // check header or url parameters or post parameters for token
      var token = req.body.token || req.query.token || req.headers['x-access-token'];
      // decode token
      if (token) {
        // verifies secret and checks exp
        jwt.verify(token, '@secrect@token', function(err, decoded) {
            if (err) {
                  return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                  // if everything is good, save to request for use in other routes
                  req.decoded = decoded;
                  next();
            }
        });

      } else {
          return res.status(403).send({
              success: false,
              message: 'No token provided.'
          });

      }
    });


router.route('/product')
      .get(function(req,res){
        Product.find({},function(err,product){

          if(err)
            return res.json({success: false,message: err});

          res.json({
            success: true,
            data: product
          });

        });
      });


router.route('/product/:productId/:username')
      .get(function(req,res){
        var productId = req.params.productId;
        var username = req.params.username;
        var productJson,userJson;
        console.time('parallel');
        //parallel async
        async.parallel([
          function(callback){
            Product.findOne({_id:productId},function(err,product){
              if(err) return res.json({success:false,message:'Can\'t load product!'});
              productJson = product;
              callback();
            });
          },
          function(callback){
            User.findOne({username:username},function(err,user){
              if(err) return res.json({success: false,message:'Can\'t load user!'});
              userJson = user;
              callback();
            });
          }
        ],function(err){ //function will call when after all tasks in the first params have called "callback"
          if(err) res.json({success:false,message:'Error database!'});
          res.json({success:true,product:productJson,user:userJson});
        })
        console.timeEnd('parallel');
      })

router.route('/product/:productId')
      .get(function(req,res,next){
        var productId = req.params.productId;
        var categoryId;
        var categoryJson;
        console.time('series');
        //series async
        async.series([
          //first task
          function(callback){
            getProductbyId(productId,function(err,product){
              if(err) return callback(err);
              categoryId = product.ProductCategoryId;
              callback();
            })
          },
          //second task call when first task call 'callback'
          function(callback){
            getCategorybyId(categoryId,function(err,category){
              if(err) return callback(err);
              categoryJson = category;
              callback();
            })
          }
        ],function(err){  //function will call when the final task has called 'callback'
          if(err) return res.json({success: false,error:'Error!'});
          res.json({success: true,category:categoryJson});
        })
        console.timeEnd('series');
      })

router.route('/productupdate')
      .get(function(req,res){
        var message='';
        Product.find({},function(err,products){
          if(err) return res.json({success: false,error: 'Error!'});
          //foreach parallel async
          async.forEach(products,function(product,callback){
            product.ProductPrice = Math.floor((Math.random() * 99) + 10);
            product.save(function(err){
              console.log(product);
              message=message+product._id+'-';
              callback();
            })
          },function(err){
            res.json({success: true,message:message});
          });
        })
      })


router.route('/getsubcategory/:productId')
      .get(function(req,res){
        var productId = req.params.productId;
        console.time('waterfall');
        // waterfall async
        async.waterfall([
          function(callback){
            getProductbyId(productId,callback);
          },//the result of task is the params of function next task
          function(product,callback){
            getCategorybyId(product.ProductCategoryId,callback);
          }
        ],function(err,category){ //all task finish
          if(err) return res.json({success: false,error:'Error!!'});
          res.json({success:true,sub:category.sub});
        });
        console.timeEnd('waterfall');
      });

function getProductbyId(productId,callback){
  Product.findOne({_id:productId},function(err,product){
    if (err) return callback(err);
    if(product==null) return callback(new Error('No user found!!'));
    callback(null,product);
  });
}

function getCategorybyId(categoryId,callback){
  Category.findOne({_id:categoryId},function(err,category){
    if(err) return callback(err);
    if(category==null) return callback(new Error('No category found!!'));
    callback(null,category);
  })
}

module.exports = router;
