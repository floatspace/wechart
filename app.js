'use strict'

var Koa = require('koa');

var Wechart = require('./wechart/g.js');
var config = require('./wechart/config.js');

var app = new Koa();
app.use(Wechart(config.wechart));

app.listen(1234);
console.log('---server start at port: 1234---');