const redis = require('./redis');
var argv = require('minimist')(process.argv.slice(2));

function router(oApp, oExpress) {
    'use strict';
    this.router = oExpress.Router();
    this.app = oApp;
    this.app.use(this.router);
    this.redisHost = argv.redisHost;
    this.redisPort = argv.redisPort;
    this.redisInstance = argv.redisInstance;
}

router.prototype.loadRoutes = function() {
    'use strict';
    var that = this;

    this.app.get("/view/*", this.jsonParser, function(oRequest, oResponse) {
        var redisClient = new redis(that.redisHost, that.redisPort, that.redisInstance);
        var key = oRequest.params[0];        
        var pPromise = new Promise((resolve, reject) => {
            resolve(redisClient.getList(key));
        }).then(function(data) {
        	oResponse.send(data);
        });
        
    });
};

router.prototype.setMiddleware = function(sName, oMiddleware, mSettings) {
    'use strict';
    this[sName] = oMiddleware;
    var oProperties = Object.getOwnPropertyNames(mSettings);
    for (var i = 0; i < oProperties.length; i++) {
        this[oProperties[i]] = mSettings[oProperties[i]];
    }
};

module.exports = router;