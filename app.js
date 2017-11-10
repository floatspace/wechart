'use strict'

var Koa = require('koa');
var path = require('path');
var Wechart = require('./wechart/g.js');
var util = require('./libs/util.js');
var token_file = path.join(__dirname, './config/accessToken.txt');
var config = {
    wechart: {
        appID: 'xxx',
        appSecret: 'xxx',
        token: 'xxx',
        getAccessToken: function() {
            return util.readFileAsync(token_file);
        },
        saveAccessToken: function(data) {
            return util.writeFileAsync(token_file, data);
        }
    }
};

var app = new Koa();

app.use(Wechart(config.wechart));

app.listen(1234);
console.log('---server start at port: 1234---');