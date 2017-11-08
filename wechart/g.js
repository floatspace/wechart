'use strict';
var sha1 = require('sha1');
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
                console.log(data);
                Promise.resolve(data);
            } else {
                return self.updateAccessToken();
            }
        })
        .then(function(data) {
            if(!data) return;
            self.access_token = data.access_token;
            self.expires_in = data.expires_in;
            self.saveAccessToken(JSON.stringify(data));
        })
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

module.exports = function(opts) {
    var wechart = new Wechart(opts);
    return function*(next) {

        var token = opts.token;
        var nonce = this.query.nonce;
        var timestamp = this.query.timestamp;
        var signature = this.query.signature;
        var echostr = this.query.echostr;
        var str = [token, timestamp, nonce].sort().join('');
        var sha = sha1(str);

        if (sha === signature) {
            this.body = echostr + '';
        } else {
            this.body = 'wrong';
        }
    };
};