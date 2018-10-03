var express = require('express');
var router = express.Router();
var config = require('../lib/remoteConfig');
var sys = require('sys')
var exec = require('child_process').exec;

/* GET users listing. */
router.get('/', function (req, res, next) {
  // res.send('get config');

  console.log("get config");

  dir = exec("git pull", function (err, stdout, stderr) {
    console.log('git pull');
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
  });
});

router.post('/', function (req, res, next) {

  console.log(req.body.read || undefined);

  // remoteConfig.update(body).then((data) => {
  //   res.send({ msg: req.body });
  // });

  var json = {
    parameters: [
      {
        key: "favorite_coffee",
        value_options: [
          {
            "value": "Welcome to this sample app again. Update.sdfs"
          }
        ]
      },
      {
        key: "welcome_message_caps",
        value_options: [
          {
            value: "yea cool"
          }
        ]
      }
    ]
  }

  // config.update(json).then(function () {
  //   res.status(200).send('update complete');
  // }, function (err) {
  //   res.status(500).send(err);
  // })

  res.send('cool');


});
module.exports = router;
