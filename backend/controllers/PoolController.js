var logger = require('log4js').getLogger('PoolController');

var managers = require('../managers');

exports.readUsers = function (req, res) {
    logger.info('getting all users');
    managers.poolClient.readAccounts(req.user.poolKey, function (err, accounts) {
        res.send(accounts);
    });
};

exports.createUsers = function (req, res) {
    logger.info('creating new user');
    managers.poolClient.createAccount(req.user.poolKey, function (err, account) {
        res.send(account);
    });
};

exports.readPools = function (req, res) {
    logger.info('getting all pools');
    managers.poolClient.readPools(req.user.poolKey, function (err, pools) {
        res.send(pools);
    });
};