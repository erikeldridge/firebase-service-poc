var config = require('./lib/remoteConfig');

config.getTemplate().then(function (token) {
	console.log(token);
});