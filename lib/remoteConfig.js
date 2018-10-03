var https = require('https');
var zlib = require('zlib');
var fs = require('fs');
var google = require('googleapis');

var PROJECT_ID = 'remote-config-poc';
var HOST = 'firebaseremoteconfig.googleapis.com';
var PATH = '/v1/projects/' + PROJECT_ID + '/remoteConfig';
var SCOPES = ['https://www.googleapis.com/auth/firebase.remoteconfig'];

var etagOrVersion = process.argv[3];

var q = require('q');

/**
 * Get a valid access token.
 */
// [START retrieve_access_token]
function getAccessToken() {
    return new Promise(function (resolve, reject) {
        var key = require( '../service-account.json');

        console.log(key.client_email);

        var jwtClient = new google.auth.JWT(
            key.client_email,
            null,
            key.private_key,
            SCOPES,
            null
        );
        jwtClient.authorize(function (err, tokens) {
            if (err) {
                reject(err);
                return;
            }
            resolve(tokens.access_token);
        });
    });
}


function publishTemplate(etag) {
    getAccessToken().then(function (accessToken) {
        var options = {
            hostname: HOST,
            path: PATH,
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json; UTF-8',
                'Accept-Encoding': 'gzip',
                'If-Match': etag
            }
        };

        var request = https.request(options, function (resp) {
            console.log(resp.statusCode);
            if (resp.statusCode === 200) {
                var newETag = resp.headers['etag'];
                console.log('Template has been published');
                console.log('ETag from server: ' + newETag);
            } else {
                console.log('Unable to publish template.');
                console.log(resp);
            }
        });

        request.on('error', function (err) {
            console.log('Request to send configuration template failed.');
            console.log(err);
        });

        request.write(fs.readFileSync(process.cwd() + '/../lib/config.json', 'UTF8'));
        request.end();
    });
}

module.exports = {
    getLatestConfig: function(){

    },
    update: function () {

        var defer = q.defer();
        // this.getLatestConfig();
        console.log('update config');
        publishTemplate("*");

        return defer.promise;
    }
}