var fs = require('fs');
var Promise = require('bluebird');

exports.readFileAsync = function(fpath, encoding) {
    return new Promise(function(resovle, reject) {
        fs.readFile(fpath, encoding, function(err, content) {
            if(err) reject(err);
            resovle(content);
        });
    });
};

exports.writeFileAsync = function(fpath, content) {
    return new Promise(function(resovle, reject) {
        fs.writeFile(fpath, content, function(err) {
            if(err) reject(err);
            resovle();
        });
    });
};

