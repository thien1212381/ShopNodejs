var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/shop', function(req, res, next) {
  res.render('shop');
});

module.exports = router;
