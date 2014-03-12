var dbManager = require('./DbManager');
var _ = require('lodash');
var sha1 = require('sha1');
var logger = require('log4js').getLogger('UsersManager');

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

exports.getPublicUserDetails = function (user ){
    return {'email' : user.email, 'isAdmin' : user.isAdmin, 'isPoolManager' : !!user.poolKey };
};


exports.createUser = function( user, callback ){
    if ( !validateEmail(user.email )){
        logger.info('invalid email on signup [%s]', user.email );
        callback( 'invalid email' );
        return;
    }

    if ( _.isEmpty(user.password ) || _.isEmpty(user.password.trim()) || user.password !== user.passwordConfirm ){
        logger.info('invalid password/confirm combination [%s]/[%s]', user.password, user.passwordConfirm);
        callback('invalid password');
        return;
    }

    logger.info('signing up user with email : ' + user.email );
    dbManager.connect('users', function(db, collection, done){
        collection.count( { 'email' : user.email }, function( err, count ){
            if ( count > 0 ){
                logger.error('user with email ' + user.email + ' already exists');
                callback('already exists');
                done();
                return;
            }else{
                delete user['confirmPassword'];
                user.password = sha1(user.password);
                collection.insert(user, function( err, obj ){
                    if ( !!err ){
                        logger.error('error creating account :' + err.message);
                        done();
                        callback('error creating account ' + err.message);
                        return;
                    }else{
                        logger.info('user created successfully');
                        callback(null, obj);
                        done();
                        return;
                    }
                })
            }
        });

    });
}