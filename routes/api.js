var express = require('express');
var router = express.Router();
var Product = require('../application/model/product');
var User = require('../application/model/user');
var jwt    = require('jsonwebtoken');


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

module.exports = router;
