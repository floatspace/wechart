'use strict';
var Promise = require('bluebird');
var request = Promise.promisify(require("request"));
var tpl = require('./tpl.js');

var preUrl = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential';
var Wechart = function(opts) {
    var self = this;
    this.appID = opts.appID;
    this.appSecret = opts.appSecret;
    this.getAccessToken = opts.getAccessToken;
    this.saveAccessToken = opts.saveAccessToken;
    this.fetchAccessToken();
};
Wechart.prototype = {
    fetchAccessToken: function() {
        var self = this;
        if(this.access_token && this.expires_in) {
            if(this.isValidAccessToken(this)) {
                return Promise.resolve(this);
            }
        }
        this.getAccessToken()
            .then(function(data) {
                try {
                    data = JSON.parse(data);
                } catch (err) {
                    return self.updateAccessToken();
                }

                if (self.isValidAccessToken(data)) {
                    return Promise.resolve(data);
                } else {
                    return self.updateAccessToken();
                }
            })
            .then(function(data) {
                self.access_token = data.access_token;
                self.expires_in = data.expires_in;
                self.saveAccessToken(JSON.stringify(data));
                return Promise.resolve(data);
            });
    },
    updateAccessToken: function() {
        var self = this;
        return new Promise(function(resolve, reject) {
            var _url = preUrl + '&appid=' + self.appID + '&secret=' + self.appSecret;
            request({ url: _url, json: true }).then(function(response) {
                var data = response.body;
                var now = new Date().getTime();
                var expires_in = now + (data.expires_in - 20) * 1000;
                data.expires_in = expires_in;
                resolve(data);
            });
        })
    },
    isValidAccessToken: function(data) {
        if (!data || !data.access_token || !data.expires_in) {
            return false;
        }
        var now = new Date().getTime();
        var expires_in = data.expires_in;
        if (now < expires_in) {
            return true;
        } else {
            return false;
        }
    },
    reply: function() {
        var message = this.message;  // 微信发来的消息
        var replyContent = this.replyContent;  // 回复的内容
        var replyXML = tpl.compiled(message, replyContent);

         console.log('回复给微信服务器的消息');
        console.log(replyXML);

        this.status = 200;
        this.type = 'application/xml';
        this.body = replyXML;
    },
    uploadMedia: function(url, type) {
        
    }
};
module.exports = Wechart;