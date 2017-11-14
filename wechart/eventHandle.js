'use strict';

var preUploadUrl = 'https://api.weixin.qq.com/cgi-bin/media/upload?access_token=';
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
            // _res = wechart.uploadMedia(url, 'image');
        }
    }
    this.replyContent = _res;
    yield next;
};