var fs = require('fs');
var xml2js = require('xml2js');
var Promise = require('bluebird');

exports.readFileAsync = function(fpath, encoding) {
    return new Promise(function(resolve, reject) {
        fs.readFile(fpath, encoding, function(err, content) {
            if (err) reject(err);
            resolve(content);
        });
    });
};

exports.writeFileAsync = function(fpath, content) {
    return new Promise(function(resolve, reject) {
        fs.writeFile(fpath, content, function(err) {
            if (err) reject(err);
            resolve();
        });
    });
};

exports.parseXMLAsync = function(xml) {
    return new Promise(function(resolve, reject) {
        xml2js.parseString(xml, { trim: true }, function(err, content) {
            if (err) reject(err);
            resolve(content);
        });
    });
};

/*
    { 
     ToUserName: [ 'gh_e3e6f0c65f32' ],
     FromUserName: [ 'ojp3C1VtixVpIi6YHd_sWlnjqY8A' ],
     CreateTime: [ '1510279910' ],
     MsgType: [ 'event' ],
     Event: [ 'subscribe' ],
     EventKey: [ '' ] 
    } 
    ==>
    { 
     ToUserName: 'gh_e3e6f0c65f32',
     FromUserName: 'ojp3C1VtixVpIi6YHd_sWlnjqY8A',
     CreateTime: '1510279910',
     MsgType: 'event',
     Event: 'subscribe',
     EventKey: '' 
    } 

 */

exports.formatMessage = function(data) {
    var result = {};
    if (typeof data === 'object') {
        var keys = Object.keys(data);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var item = data[key];

            if (!(item instanceof Array) || item.length === 0) {
                continue;
            }

            if (item.length === 1) {
                var val = item[0];
                if (typeof val === 'object') {
                    result[key] = formatMessage[val];
                } else {
                    result[key] = (val || '').trim();
                }
            } else {
                result[key] = [];
                for (var j = 0; j < item.length; j++) {
                    result[key].push(item[j]);
                }
            }
        }
    }
    return result;
};