var argv = require('minimist')(process.argv.slice(2));
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const router = require("./router");
const redis = require('./redis');
const uuid = require('uuid/v1');
var redisHost = '127.0.0.1';
var redisPort = 6379;
var redisInstance = 0;
var redisChannel = 'view:list:*';
var redisClient = new redis(redisHost, redisPort, redisInstance);

var oApp = express();
var oRouter = new router(oApp, express);

express.static.mime.default_type = "text/xml";

oApp.use(bodyParser.urlencoded({
    extended: false
}));
oRouter.setMiddleware("bodyParser", bodyParser, {
    jsonParser: bodyParser.json()
});
oRouter.loadRoutes();
oApp.listen(3001);

function fnCallback(pattern, channel, message) {
	pattern = pattern.substring(0, pattern.length - 1);
	var listKey = channel.replace(pattern, '');
	var tempClient = new redis(redisHost, redisPort, redisInstance);
	var pList = new Promise((resolve, reject) => {
		console.log(listKey);
		resolve(tempClient.read(listKey));
	}).then(function(response) {
		console.log(response);
		tempClient.publish(message, JSON.stringify(response));
		tempClient.quit();
	});
}

redisClient.subscribe(redisChannel, fnCallback);