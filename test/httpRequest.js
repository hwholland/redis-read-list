/*
var http = require('http');
var request = require('request');
request('http://127.0.0.1:3001/read/world', function(error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); // Print the HTML for the Google homepage.
});
*/

    const path = require('path');
    const redis = require('../redis');

    var redisHost = '127.0.0.1';
    var redisPort = 6379;
    var redisInstance = 0;
    var redisChannel = 'view:list:world';

    var testData = 'world'

    var redisClient = new redis(redisHost, redisPort, redisInstance);
    redisClient.publish(redisChannel, testData);

