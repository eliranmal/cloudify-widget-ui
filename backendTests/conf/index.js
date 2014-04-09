var fs = require('fs');
var logger = require('log4js').getLogger('TestConf');
var async = require('async');
var _  = require('lodash');
var meConf = 'backendTests/conf/dev/overrides.json';
var prodConf = 'backendTests/conf/defaults.json';

var data;
if ( fs.existsSync(prodConf) ){
    var data = fs.readFileSync(prodConf, 'utf8');
    if (!!data) {
        _.assign(module.exports, JSON.parse(data));
    }
}else{
    logger.info(prodConf , ' file does not exist. skipping');
}

if (fs.existsSync(meConf)) {

    data = fs.readFileSync(meConf, 'utf8');
    if (!!data) {
        _.assign(module.exports, JSON.parse(data));
    }
}else{
    logger.info(meConf , ' file does not exist. skipping');
}