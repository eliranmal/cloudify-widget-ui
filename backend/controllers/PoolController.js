var logger = require('log4js').getLogger('PoolController');

var managers = require('../managers');

exports.readUsers = function (req, res) {
    logger.info('users called in pool controller');
    managers.poolClient.readAccounts( req.user.poolKey, function( err, accounts ){
        res.send(accounts);
    });
};


exports.createUsers = function( req, res ){
    logger.info('creating new user');
    managers.poolClient.createAccounts( req,user,poolKey, function ( err, account){
        res.send(account);
    });
};