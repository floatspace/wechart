var path = require('path');

var util = require('../libs/util.js');
var token_file = path.join(__dirname, '../config/accessToken.txt');

exports.wechart = {
    appID: 'wx8a6dfaa735367fbf',
    appSecret: '3f5474279c92c80df7a6ad7e7a185d8c',
    token: 'floatspace19881011fearless',
    getAccessToken: function() {
        return util.readFileAsync(token_file);
    },
    saveAccessToken: function(data) {
        return util.writeFileAsync(token_file, data);
    }
};