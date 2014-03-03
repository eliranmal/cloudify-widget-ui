var fs = require('fs');
var async = require('async');
var _  = require('lodash');
var meConf = 'conf/dev/me.json';
var prodConf = 'conf/dev/prod.json';

var conf;


var data = fs.readFileSync(prodConf, 'utf8');
_.assign(module.exports, JSON.parse(data));
data = fs.readFileSync(meConf, 'utf8');
_.assign(module.exports, JSON.parse(data));

