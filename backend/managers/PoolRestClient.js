var logger = require('log4js').getLogger('PoolRestClient');

// var ajax = require('http');
var Client = require('node-rest-client').Client;

exports.getAccounts = function(){

    logger.info('get accounts called on pool rest client')

    var client = new Client;
    // TODO base url to conf or something
    client.get('http://localhost:8011/admin/accounts', function (data, response) {
        console.log('got response from admin');
    });

}