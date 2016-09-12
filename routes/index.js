var express = require('express');
var IndexController = require('../application/controllers/IndexController');
var router = express.Router();

/* GET home page. */
router.get('/', IndexController.Index);

router.get('/shop', function(req, res, next) {
  res.render('shop', { title: 'Shop' });
});

module.exports = router;
