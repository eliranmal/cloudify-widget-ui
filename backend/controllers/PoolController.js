var logger = require('log4js').getLogger('PoolController');

var rest = require('../managers');

exports.users = function (req, res) {
    logger.info('users called in pool controller')
    return rest.getAccounts();
};