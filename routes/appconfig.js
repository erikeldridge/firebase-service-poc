var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send({ msg; "it works", request: req.body  });
});

module.exports = router;
