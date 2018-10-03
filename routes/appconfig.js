var express = require('express');
var router = express.Router();
var config = require('../lib/remoteConfig');
var sys = require('sys')
var exec = require('child_process').exec;

/* GET users listing. */
router.get('/', function (req, res, next) {
  // res.send('get config');

  res.status(200).send('get remote config');

});

router.post('/', function (req, res, next) {
  dir = exec("git pull", function (err, stdout, stderr) {
    console.log('Git pull latest config');
    if (err) {
      // should have err.code here?  
    }
    console.log(stdout);
  });

  dir.on('exit', function (code) {
    // exit code is code

    config.update().then(function () {
      res.status(200).send('get complete');
    });

    res.status(200).send('get config complete');
  });

});
module.exports = router;
