var logger = require('log4js').getLogger('WidgetLoginsController');
var passport = require('passport');
var conf = require('../Conf');
var managers = require('../managers');
var GoogleStrategy = require('passport-google').Strategy;
var LinkedInStrategy = require('passport-linkedin').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
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


var closePopupResponse = '<html><body><script>window.opener.$windowScope.loginDone( );</script></body></html>';

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
        res.send(200, closePopupResponse );
    } );
};

exports.linkedInLogin = function( req, res, next ){

    var widgetId = req.params.widgetId;

    passport.use(new LinkedInStrategy({
            consumerKey: conf.linkedIn.apiKey,
            consumerSecret: conf.linkedIn.secretKey,
            profileFields: ['id', 'first-name', 'last-name', 'email-address', 'headline'],

            callbackURL: req.absoluteUrl('/backend/widgets/' + widgetId + '/login/linkedin/callback')
        },
        function(token, tokenSecret, profile, done) {
            logger.info('linkedin logged in success',arguments);
        }
    ));

    passport.authenticate('linkedin', { scope: ['r_basicprofile', 'r_emailaddress'] })( req, res, next );
};

exports.linkedInLoginCallback = function( req, res ){

    var request = require('request');
    logger.info(req.query.oauth_token);
    var options =
    {
        url: 'https://api.linkedin.com/v1/people/~/email-address',
//        url: 'https://api.linkedin.com/v1/people/~',
        headers: { 'x-li-format': 'json' },


        qs: { oauth2_access_token: req.query.oauth_token } // or &format=json url parameter
    };
    request(options, function ( error, r, body ) {
        logger.info('hello',error, body);
        res.send( { 'query' : req.query, 'error' : error, 'body' : body} );
        if ( r.statusCode != 200 ) {
            return;
        }
        try {
            logger.info(body);

        }
        catch (e) {
            return;
        }
    });

//    logger.info('linkedin login callback',req);

};


exports.twitterLogin = function ( req, res, next ){
    var widgetId = req.params.widgetId;

    passport.use(new TwitterStrategy({
            consumerKey: conf.twitter.apiKey,
            consumerSecret: conf.twitter.secretKey,
            callbackURL: req.absoluteUrl('/backend/widgets/' + widgetId + '/login/twitter/callback')
        },
        function(token, tokenSecret, profile, done) {
            logger.info('twitter function was called');

        }
    ));

    passport.authenticate('twitter')( req, res, next );
};


exports.twitterLoginCallback = function( req, res ){
    res.send(req.query);
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