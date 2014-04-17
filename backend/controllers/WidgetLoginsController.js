var passport = require('passport');
var GoogleStrategy = require('passport-google').Strategy;



// Redirect the user to Google for authentication.  When complete, Google
// will redirect the user back to the application at
//     /auth/google/return
exports.googleLogin  = function( req, res, next ){

    console.dir(req);
    res.send(200);
//    passport.use(new GoogleStrategy({
//            returnURL: 'http://www.example.com/auth/google/return',
//            realm: 'http://www.example.com/'
//        },
//        function(identifier, profile, done) {
//            User.findOrCreate({ openId: identifier }, function(err, user) {
//                done(err, user);
//            });
//        }
//    ));

//    passport.authenticate('google')( req, res, next );
};

// Google will redirect the user to this URL after authentication.  Finish
// the process by verifying the assertion.  If valid, the user will be
// logged in.  Otherwise, authentication has failed.
exports.googleLoginCallback = function( req, res ){
   res.send(200);
};