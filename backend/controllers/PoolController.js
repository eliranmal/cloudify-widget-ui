var logger = require('log4js').getLogger('PoolController');

var managers = require('../managers');

function _callback( res, callback ){
    return function( err, data ){
        if ( !!err ){
            res.send(err.response.statusCode, err.data);
        }
        if ( !!callback ){
            callback(data);
        }
        else{
            res.send(data);
        }
    }
}

exports.createUsers = function( req, res ){
    managers.poolClient.createAccounts( req.user.poolKey, _callback ( res ) )
};

exports.readUsers = function (req, res) {
    managers.poolClient.readAccounts( req.user.poolKey, _callback( res ) )
};

exports.adminReadPools = function ( req, res ){
    managers.poolClient.adminReadPools (req.user.poolKey, _callback(res ) );
};

exports.readAccountPools = function( req, res ){
    managers.poolClient.readAccountPools( req.user.poolKey, req.params.accountId, _callback(res))
};


