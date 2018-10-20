var config = require('./lib/remoteConfig');
var key = require( './test-service-account.json');

config.getAccessToken(key).then(function (token) {
	console.log(token);
});