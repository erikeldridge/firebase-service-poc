var https = require('https');
var zlib = require('zlib');
var fs = require('fs');
var google = require('googleapis');

var PROJECT_ID = 'erikeldridge-rc-test';
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
    // console.log('getting access token')
    return new Promise(function (resolve, reject) {
        var key = require( '../test-service-account.json');

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


function getTemplate() {
    console.log('getting latest template')
    var defer = q.defer();
    getAccessToken().then(function(accessToken) {
      var options = {
        hostname: HOST,
        path: PATH,
        headers: {
          'Authorization': 'Bearer ' + accessToken,
          'Accept-Encoding': 'gzip',
        }
      };
  
      var buffer = [];
      var request = https.request(options, function(resp) {
        if (resp.statusCode == 200) {
   
      var gunzip = zlib.createGunzip();
          resp.pipe(gunzip);
  
          gunzip.on('data', function(data) {
            console.log(data.toString());
            buffer.push(data.toString());
          }).on('end', function() {
            // fs.writeFileSync('config.json', buffer.join(''));
            console.log('Retrieved template has been written to config.json');
            var etag = resp.headers['etag'];
            console.log('\n\nsaved access token: ' + accessToken);
            console.log('saved etag: ' + etag + '\n\n');
            defer.resolve(etag);
          }).on('error', function(err) {
            defer.reject(err); 
            console.error('Unable to decompress template.');
            console.error(err);
          });
  //	console.log(resp);
        } else {
          console.log('Unable to get template.');
          console.log(resp.error);
        }
      });
  
      request.on('error', function(err) {
        console.log('Request for configuration template failed.');
        console.log(err);
      });
  
      request.end();
    });

    return  defer.promise;
  }




function publishTemplate(etag) {
    console.log('publish template');
    
    getAccessToken().then(function (accessToken) {
        // console.log("accesstoken: " + accessToken);
        // console.log("etag: " + etag);
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
            console.log(options);
            console.log(resp.statusCode);
            console.log(resp.body || undefined);
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

        var filepath = process.cwd() + '/lib/config.json';

        request.write(fs.readFileSync(filepath, 'UTF8'));
        request.end();
    });
}

module.exports = {
    getLatestConfig: function(){

    },
    update: function () {
        console.log('updating firebase remote config')
        var defer = q.defer();
        getTemplate().then(etag=>{
            console.log(etag);
            publishTemplate(etag)
        });
        return defer.promise;
    }
}
