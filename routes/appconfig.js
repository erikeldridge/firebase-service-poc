var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.send("it works");
});


router.push('/', function(req, res, next){
  res.send({msg: req.body});
});
module.exports = router;
