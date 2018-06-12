
function pubsub() {
    const path = require('path');
    const redis = require('../redis');
    const uuid = require('uuid/v1');

    var redisHost = '127.0.0.1';
    var redisPort = 6379;
    var redisInstance = 0;
    var redisChannel = 'view:list:business:nodes';
    var uId = uuid();

    var subscribeClient = new redis(redisHost, redisPort, redisInstance);
    var publishClient = new redis(redisHost, redisPort, redisInstance);

    function callback(pattern, channel, message) {
        console.log("------------------");
        console.log("pub/sub: ");
        console.log("channel: " + channel);
        console.log("message: " + message);
    }

    subscribeClient.subscribe(uId, callback);
    publishClient.publish(redisChannel, uId);
}

function request() {
    const get = require('simple-get');
    get('http://127.0.0.1:3001/read/list/business:nodes', function(err, res) {
        if (err) { 
            throw err;
        }
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            console.log("request/response: " + chunk);
            pubsub();
        });
    });
}

request();