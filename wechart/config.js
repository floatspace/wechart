var path = require('path');

var util = require('../libs/util.js');
var token_file = path.join(__dirname, '../config/accessToken.txt');

exports.wechart = {
    appID: 'wx560c02eceb4a2e66',
    appSecret: '1f9265d717973987ac1abe6561cc43f0',
    token: 'floatspace19881011fearless',
    getAccessToken: function() {
        return util.readFileAsync(token_file);
    },
    saveAccessToken: function(data) {
        return util.writeFileAsync(token_file, data);
    }
};