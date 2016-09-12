var express = require('express');
var TestController = require('../application/controllers/TestController');
var router = express.Router();

/* GET home page. */
router.get('/', TestController.Index);


module.exports = router;
