var logger = require('log4js').getLogger('WidgetLoginsController');
var passport = require('passport');
var managers = require('../managers');
var GoogleStrategy = require('passport-google').Strategy;
var _ = require('lodash');




// Redirect the user to Google for authentication.  When complete, Google
// will redirect the user back to the application at
//     /auth/google/return
exports.googleLogin  = function( req, res, next ){

    var widgetId = req.params.widgetId;



    passport.use(new GoogleStrategy({
            returnURL: req.absoluteUrl('/backend/widgets/' + widgetId + '/login/google/callback'),
            realm: req.absoluteUrl('')
        },
        function(identifier, profile, done) {
            logger.info('google identifier', identifier);
            done(err, { 'id' : identifier });
        }
    ));
//
    passport.authenticate('google')( req, res, next );
};



exports.getAllLogins = function( req, res ){
    managers.widgetLogins.getAllWidgetLogins( req.user._id , function( err, result ){
        if ( !!err ){
            res.send(500, err.message);
            return;
        }
        res.send(result);
    })
};



// Google will redirect the user to this URL after authentication.  Finish
// the process by verifying the assertion.  If valid, the user will be
// logged in.  Otherwise, authentication has failed.
exports.googleLoginCallback = function( req, res ){
    var widgetId = req.params.widgetId;

    managers.widgetLogins.handleGoogleLogin( widgetId , req.query, function( err, loginModel ){
        if ( !!err ){
            err.send(res);
            return;
        }

        if ( !loginModel ){
            res.send(500, 'internal error problem');
            return;
        }

        req.session.socialLoginId = loginModel._id;
        res.send(200, "<html><body><script>window.opener.$windowScope.loginDone( );</script></body></html>");
    } );


};


