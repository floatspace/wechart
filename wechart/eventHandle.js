'use strict';

exports.dealEvent = function*(next) {
    var msg = this.message;
    if (msg.MsgType === 'event') {
        if (msg.Event === 'subscribe') {
            this.replyContent = '欢迎你的关注, 你会后悔的, 哇哈哈哈~';
        } else if (msg.Event === 'unsubscribe') {
            console.log(msg.FromUserName + '取消了关注');
            this.replyContent = '';
        }
    } else if (msg.MsgType === 'text') {
        if (msg.Content == '1') {
            this.replyContent = '天下第一';
        } else if(msg.Content == '2') {
            this.replyContent = '天下第二';
        } else if(msg.Content == '3') {
            this.replyContent = [{
                title: '来百度看看',
                description: '下面是百度图片',
                picurl: 'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png',
                url: 'https://www.baidu.com/'
            }];
        } else if(msg.Content == '段') {
            this.replyContent = '段之宇这个屌丝!';
        }
    }
    yield next;
};