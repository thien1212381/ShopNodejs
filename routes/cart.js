var express = require('express');
var CartController = require('../application/controllers/CartController');
var router = express.Router();

/* GET home page. */
router.get('/', CartController.Index);
router.get('/add/(:product_id)\/(:type)?',CartController.Add);
router.get('/remove/:product_id',CartController.Remove);
module.exports = router;
