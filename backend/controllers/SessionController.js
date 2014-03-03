var logger = require('log4js').getLogger('SessionController');
var sha1 = require('sha1');
var _ = require('lodash');
var managers = require('../managers');

exports.login = function(req, res){
    var credentials = req.body;
    logger.info('logging in user with email ' + credentials.email );
    managers.db.connect('users', function(db, collection, done){
        collection.findOne({email:credentials.email, password:sha1(credentials.password)}, function( err, obj ){
            if ( !!err ){
                res.send(500, {'message': 'unable to login ' + err.message});
                done();
                return;
            }
            if ( !!obj ){
                logger.info('user ' + credentials.email + ' logged in');
                req.session.userId = obj._id.toString();
                res.send({'message': 'successfully logged in'});
                done();
                return;
            }else{
                logger.info('could not find user with these credentials : ' + credentials.email );
                res.send(500, {'message': 'wrong username/password'});
                done();
                return;
            }
        });
    });
};

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

exports.signup = function(req , res){
     var user = req.body;

    if ( !validateEmail(user.email )){
        logger.info('invalid email on signup [%s]', user.email );
        res.send(500, {'message' : 'invalid email'});
        return;
    }

    if ( _.isEmpty(user.password ) || _.isEmpty(user.password.trim()) || user.password !== user.passwordConfirm ){
        logger.info('invalid password/confirm combination [%s]/[%s]', user.password, user.passwordConfirm);
        res.send(500, { 'message' : 'invalid password'});
        return;
    }

    logger.info('signing up user with email : ' + user.email );
    managers.db.connect('users', function(db, collection, done){
        collection.count( { 'email' : user.email }, function( err, count ){
            if ( count > 0 ){
                logger.error('user with email ' + user.email + ' already exists');
                res.send(500, {'message':'already exists'});
                done();
                return;
            }else{
                delete user['confirmPassword'];
                user.password = sha1(user.password);
                collection.insert(user, function( err, obj ){
                    if ( !!err ){
                        logger.error('error creating account :' + err.message);
                        done();
                        return;
                    }else{
                        logger.info('user created successfully')
                        res.send(obj);
                        done();
                        return;
                    }
                })
            }
        });

    });
};

exports.logout = function( req, res ){
//    req.session.destroy();
    req.session = null;
    res.send({'message': 'logged out successfully'});
}