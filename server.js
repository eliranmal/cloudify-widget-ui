/**
 * Module dependencies.
 */

var express = require('express')
    , controllers = require('./backend/controllers')
    , managers = require('./backend/managers');

var app = module.exports = express();

// Configuration
var conf = require('./backend/Conf');
console.log(JSON.stringify(conf));

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.cookieSession({ secret: 'your secret here' }));
    app.use('/backend/user/widgets', managers.middleware.loggedUser);
    app.use(app.router);

});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

// Routes

app.post('/backend/signup', controllers.session.signup);
app.post('/backend/login', controllers.session.login );
app.post('/backend/logout', controllers.session.logout);
app.get('/backend/user/widgets', controllers.widgets.list);

var server = app.listen(9001, function(){
    console.log("Express server listening on port %d in %s mode", server.address().port, app.settings.env);
});
