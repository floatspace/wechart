'use strict';
var sha1 = require('sha1');
var getRawBody = require('raw-body');
var Wechart = require('./wechart.js');
var util = require('../libs/util.js');

module.exports = function(opts) {
    // access_token判断逻辑
    // var wechart = new Wechart(opts);
    return function*(next) {

        var token = opts.token;
        var nonce = this.query.nonce;
        var timestamp = this.query.timestamp;
        var signature = this.query.signature;
        var echostr = this.query.echostr;
        var str = [token, timestamp, nonce].sort().join('');
        var sha = sha1(str);
        var that = this;
        // 验证token
        if (this.method === 'GET') {
            if (sha === signature) {
                console.log('token验证成功');
                this.body = echostr + '';
            } else {
                this.body = 'wrong';
            }
        }
        // POST请求
        if (this.method === 'POST') {
            if (sha !== signature) {
                this.body = 'wrong';
                console.log('token验证失败');
                return false;
            }
            // 获取post请求过来的原始xml数据
            var data = yield getRawBody(this.req, {
                length: this.length,
                limit: '1mb',
                encoding: this.charset
            });

            // 解析xml
            var content = yield util.parseXMLAsync(data);

            // 格式化xml
            var message = util.formatMessage(content.xml);
            this.message = message;

            // 通过关注与取关或者发送消息测试输出信息
            console.log(message);

            // 设置回复消息(关注与取关)
            if (message.MsgType === 'event') {
                if (message.Event === 'subscribe') {
                    var now = new Date().getTime();
                    that.status = 200;
                    that.type = 'application/xml';

                    var replyXml = '<xml>' +
                        '<ToUserName><![CDATA[' + message.FromUserName + ']]></ToUserName>' +
                        '<FromUserName><![CDATA[' + message.ToUserName + ']]></FromUserName>' +
                        '<CreateTime>' + now + '</CreateTime>' +
                        '<MsgType><![CDATA[text]]></MsgType>' +
                        '<Content><![CDATA[你好, 欢迎来到微信开发者的世界, FLS!]]></Content>' +
                        '</xml>';
                    that.body = replyXml;
                    return;
                }
            }
        }
    };
};