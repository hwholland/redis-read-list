var argv = require('minimist')(process.argv.slice(2));
const path = require('path');
const redis = require('./redis');

var redisHost = argv.redisHost;
var redisPort = argv.redisPort;
var redisInstance = argv.redisInstance;
var redisChannel = 'view:list:*';
var redisClient = new redis(redisHost, redisPort, redisInstance);

function fnCallback(pattern, channel, message) {
	pattern = pattern.substring(0, pattern.length - 1);
	var listKey = channel.replace(pattern, '');
	var tempClient = new redis(redisHost, redisPort, redisInstance);
	//tempClient.read(listKey);
	var pList = new Promise((resolve, reject) => {
		resolve(tempClient.read(listKey));
	}).then(function(response) {
		console.log(response);
	});
}

redisClient.subscribe(redisChannel, fnCallback);