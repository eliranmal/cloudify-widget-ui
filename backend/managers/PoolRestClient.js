var logger = require('log4js').getLogger('PoolRestClient');
var conf = require('../Conf');

// var ajax = require('http');
var Client = require('node-rest-client').Client;
var client = new Client;

function _getBaseUrl() {
    return conf.poolRestUrl.protocol + "://" + conf.poolRestUrl.domain + ":" + conf.poolRestUrl.port;
}

function _url(relativePath) {
    var result = _getBaseUrl() + relativePath;
    logger.debug('calling [%s]', result);
    return result;
}


function Call() {

    function _callbackWrapper(callback) {
        return function (data, response) {
            if (response.statusCode == 200) {
                callback(null, data);
            } else {
                logger.info('got an error from rest client', data, response);
                callback(new Error([data, response]))
            }
        }
    }

    this.post = function (url, args, callback) {
        logger.info('POST: ', arguments);
        client.post(url, args, _callbackWrapper(callback));
    };

    this.get = function (url, args, callback) {
        logger.info('GET: ', arguments);
        client.get(url, args, _callbackWrapper(callback));
    };

}

var call = new Call();

var _defaultHeaders = function (poolKey) {
    return {
        "headers": { "AccountUuid": poolKey }
    }
};


exports.createAccounts = function (poolKey, callback) {
    logger.info('creating account');
    call.post(_url('/admin/accounts'), _defaultHeaders(poolKey), callback);
};

exports.readAccounts = function (poolKey, callback) {
    logger.info('get accounts called on pool rest client');
    call.get(_url('/admin/accounts'), _defaultHeaders(poolKey), callback);

};