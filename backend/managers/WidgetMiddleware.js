var dbManager = require('./DbManager');
var ObjectID = require('mongodb').ObjectID;
var logger = require('log4js').getLogger('widgetMiddleware');

exports.loggedUser = function ( req, res, next ){

    if ( !req.session ){
        res.send(401, {'message': 'need to login. no session'});
        return;
    }
    var userId = req.session.userId;
    console.log(JSON.stringify(req.session));
    if ( !userId ){
        res.send(401, {'message':'need to login'});
        return;
    }


    dbManager.connect('users', function(db, collection, done){
        collection.findOne({_id: new ObjectID(userId)}, function(err, result){
            if ( !!err ){
                logger.info('unable to verify if user is logged in');
                res.send(401, {'message' : 'unable to verify session : '  + err.message });
                done();
                return;
            }
            if ( !!result ){
                logger.info('user is logged in : '  + result.email );
                req.user = result;
                done();
                next();
            }

        })
    })
};