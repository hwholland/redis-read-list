const redis = require('./redis');
var argv = require('minimist')(process.argv.slice(2));

function router(oApp, oExpress) {
    'use strict';
    this.router = oExpress.Router();
    this.app = oApp;
    this.app.use(this.router);
    this.redisHost = '127.0.0.1';
    this.redisPort = 6379;
    this.redisInstance = 0;
    this.redisClient = new redis(this.redisHost, this.redisPort, this.redisInstance);
}

router.prototype.loadRoutes = function() {
    'use strict';
    var that = this;

    this.app.get("/read/list/*", function(oRequest, oResponse) {
        var listKey = oRequest.params[0];
        var pList = new Promise((resolve, reject) => {
            console.log(listKey);
            resolve(that.redisClient.read(listKey));
        }).then(function(response) {
            console.log(response);
            oResponse.send(response);
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