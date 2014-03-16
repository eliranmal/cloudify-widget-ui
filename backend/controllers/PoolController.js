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
    managers.poolClient.createAccount( req.user.poolKey, _callback ( res ) )
};

exports.readUsers = function (req, res) {
    managers.poolClient.readAccounts( req.user.poolKey, _callback( res ) )
};

exports.adminReadPools = function ( req, res ){
    managers.poolClient.adminReadPools (req.user.poolKey, _callback(res ) );
};

exports.adminReadAccountPools = function( req, res ){
    managers.poolClient.adminReadAccountPools( req.user.poolKey, req.params.accountId, _callback(res))
};


exports.createAccountPools = function( req, res ){
    managers.poolClient.createAccountPools( req.user.poolKey, req.params.accountId, req.body,  _callback(res))
};

exports.updateAccountPools = function( req, res ){
    managers.poolClient.updateAccountPools( req.user.poolKey, req.params.accountId, req.params.poolId, req.body, _callback(res))
};

exports.deleteAccountPools = function( req, res ){
    managers.poolClient.deleteAccountPools( req.user.poolKey, req.params.accountId, req.params.poolId, _callback(res))
};

exports.adminReadAccountPool = function( req, res ){
    managers.poolClient.readAccountPool( req.user.poolKey, req.params.accountId, req.params.poolId,  _callback(res))
};

// detailed status
exports.readPoolStatus = function( req, res ){
    managers.poolClient.readPoolStatus( req.user.poolKey, req.params.poolId, _callback(res))
};

// general status
exports.readPoolsStatus = function( req, res ){
    managers.poolClient.readPoolStatus( req.user.poolKey, _callback(res))
};

exports.addMachine = function( req, res ){
    managers.poolClient.addMachine( req.user.poolKey, req.params.poolId, _callback(res))
};
exports.bootstrapMachine = function( req, res ){
    managers.poolClient.bootstrapMachine( req.user.poolKey, req.params.poolId, req.params.nodeId, _callback(res))
};
exports.deleteMachine = function( req, res ){
    managers.poolClient.deleteMachine( req.user.poolKey, req.params.poolId, req.params.nodeId, _callback(res))
};


/**************** ACCOUNT LEVEL CALLS ***************************/

exports.accountReadPools = function( req, res ){
    managers.poolClient.accountReadPools( req.user.poolKey, _callback(res))
};

exports.createPool = function( req, res ){
    managers.poolClient.createPool( req.user.poolKey, req.body, _callback(res))
};

exports.updatePool = function( req, res ){
    managers.poolClient.updatePool( req.user.poolKey, req.params.poolId, req.body, _callback(res))
};

exports.deletePool = function( req, res ){
    managers.poolClient.deletePool( req.user.poolKey, req.params.poolId, _callback(res))
};

exports.accountReadPoolStatus = function( req, res ){
    managers.poolClient.accountReadPoolStatus( req.user.poolKey, req.params.poolId, _callback(res))
};

exports.accountReadPoolsStatus = function( req, res ){
    managers.poolClient.accountReadPoolsStatus( req.user.poolKey, _callback(res))
};


