'use strict';
var fs = require('fs');
var Promise = require('bluebird');
var request = Promise.promisify(require("request"));

var tpl = require('./tpl.js');

var preUrl = 'https://api.weixin.qq.com/cgi-bin';
var preAccessTokenUrl = preUrl + '/token?grant_type=client_credential';
var wechartApi = {
    upload: {
        temp: preUrl + '/media/upload', // ?access_token=ACCESS_TOKEN&type=TYPE
    }
};

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
        return new Promise(function(resolve, reject) {
            if(self.access_token && self.expires_in) {
                if(self.isValidAccessToken(self)) {
                    resolve(self);
                }
            }
            self.getAccessToken()
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
                    resolve(data);
                });

        });
    },
    updateAccessToken: function() {
        var self = this;
        return new Promise(function(resolve, reject) {
            var _url = preAccessTokenUrl + '&appid=' + self.appID + '&secret=' + self.appSecret;
            request({ url: _url, json: true }).then(function(response) {
                var data = response.body;
                var now = new Date().getTime();
                var expires_in = now + (data.expires_in - 20) * 1000;
                data.expires_in = expires_in;
                resolve(data);
            });
        });
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
    uploadMaterial: function(type, filePath) {
        var self = this;
        var formData = {
            media: fs.createReadStream(filePath)
        };
        return new Promise(function(resolve, reject) {
            self.fetchAccessToken()
                .then(function(data) {
                    var _url = wechartApi.upload.temp + '?access_token=' + data.access_token + '&type=' + type;
                    request({method: 'POST', url: _url, json: true, formData: formData})
                    .then(function(res) {
                        var _data = res.body;
                        if(_data) {
                            resolve(_data);
                        } else {
                            throw new Error('upload material failed');
                        }
                    })
                    .catch(function(err) {
                        reject(err);
                    });
            });
        });
    }
};
module.exports = Wechart;