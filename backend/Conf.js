var fs = require('fs');
var async = require('async');
var _  = require('lodash');
var meConf = 'conf/dev/me.json';
var prodConf = 'conf/prod.json';

var conf;

var data = fs.readFileSync(prodConf, 'utf8');
if (!!data) {
    _.assign(module.exports, JSON.parse(data));
}
data = fs.readFileSync(meConf, 'utf8');
if (!!data) {
    _.assign(module.exports, JSON.parse(data));
}