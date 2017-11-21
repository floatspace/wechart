'use strict';
var path = require('path');
var Wechart = require('./wechart.js');
var config = require('./config.js');

var wechart = new Wechart(config.wechart);

exports.dealEvent = function*(next) {
    var msg = this.message;
    var _res;
    if (msg.MsgType === 'event') {
        if (msg.Event === 'subscribe') {
            _res = '欢迎你的关注, 你会后悔的, 哇哈哈哈~';
        } else if (msg.Event === 'unsubscribe') {
            console.log(msg.FromUserName + '取消了关注');
            _res = '';
        }
    } else if (msg.MsgType === 'text') {
        if (msg.Content == '1') {
            _res = '天下第一';
        } else if(msg.Content == '2') {
            _res = '天下第二';
        } else if(msg.Content == '3') {
            _res = [{
                title: '来百度看看',
                description: '下面是百度图片',
                picurl: 'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png',
                url: 'https://www.baidu.com/'
            }];
        } else if(msg.Content == '4') {
            var data = yield wechart.uploadMaterial('image', path.resolve(__dirname, '../asset/01.png'));
            console.log('临时素材接口测试');
            console.log(data);
            _res = {
                type: 'image',
                media_id: data.media_id
            };
        } else if(msg.Content == '5') {
            var data = yield wechart.uploadMaterial('image', path.resolve(__dirname, '../asset/02.png'), {type: 'image'});
            console.log('永久素材接口测试');
            console.log(data);
            _res = {
                type: 'image',
                media_id: data.media_id
            };
        }
    }
    this.replyContent = _res;
    yield next;
};