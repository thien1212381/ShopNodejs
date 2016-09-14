var express = require('express');
var IndexController = require('../application/controllers/IndexController');
var router = express.Router();

/* GET home page. */
router.get('/shop', IndexController.Index);

router.get('/', IndexController.Product);

module.exports = router;
