'use strict';
var Promise = require('bluebird');
var request = Promise.promisify(require("request"));

var preUrl = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential';
var Wechart = function(opts) {
    var self = this;
    this.appID = opts.appID;
    this.appSecret = opts.appSecret;
    this.getAccessToken = opts.getAccessToken;
    this.saveAccessToken = opts.saveAccessToken;
    this.getAccessToken()
        .then(function(data) {
            try {
                data = JSON.parse(data);
            } catch(err) {
                return self.updateAccessToken();
            }

            if(self.isValidAccessToken(data)) {
                return Promise.resolve(data);
            } else {
                return self.updateAccessToken();
            }
        })
        .then(function(data) {
            self.access_token = data.access_token;
            self.expires_in = data.expires_in;
            self.saveAccessToken(JSON.stringify(data));
        });
};
Wechart.prototype = {
    updateAccessToken: function() {
        var self = this;
        return new Promise(function(resolve, reject) {
            var _url = preUrl + '&appid=' + self.appID + '&secret='+ self.appSecret;
            request({url: _url, json: true}).then(function(response) {
                var data = response.body;
                var now = new Date().getTime();
                var expires_in = now + (data.expires_in -20) * 1000;
                data.expires_in = expires_in;
                resolve(data);
            });            
        })
    },
    isValidAccessToken: function(data) {
        if(!data || !data.access_token || !data.expires_in) {
            return false;
        }
        var now = new Date().getTime();
        var expires_in = data.expires_in;
        if(now < expires_in) {
            return true;
        } else {
            return false;
        }
    }
};
module.exports = Wechart;