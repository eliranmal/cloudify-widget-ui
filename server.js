/**
 * Module dependencies.
 */

var express = require('express')
    , controllers = require('./backend/controllers')
    , logger = require('log4js').getLogger('server')
    , managers = require('./backend/managers');

var app = module.exports = express();

// Configuration
var conf = require('./backend/Conf');
console.log(JSON.stringify(conf));

if ( !!conf.adminUser ){
    conf.adminUser.passwordConfirm = conf.adminUser.password;
    conf.adminUser.firstName = 'admin';
    conf.adminUser.lastName = 'admin';
    conf.adminUser.poolKey = '7859674589673489567';
    conf.adminUser.isAdmin = true;
    managers.users.createUser(conf.adminUser, function(err, user){
        if ( !!err && err.indexOf('exists') < 0 ){
            logger.error('unable to create admin user ' + err);
        }else{
            logger.info('admin user created successfully');
        }
    })
}

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.cookieSession({ secret: 'your secret here' }));
    app.use('/backend/user', managers.middleware.loggedUser);
    app.use('/backend/admin', managers.middleware.loggedUser);
    app.use('/backend/admin', managers.middleware.adminUser);
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
app.post('/backend/user/widgets', controllers.widgets.create);
app.post('/backend/user/widgets/:widgetId/delete', controllers.widgets.delete);
app.get('/backend/user/widgets/:widgetId', controllers.widgets.read);
app.post('/backend/user/widgets/:widgetId/update', controllers.widgets.update);
app.post('/backend/widgets/:widgetId/play', function(req, res){  res.send(500, 'TBD')});
app.post('/backend/widgets/:widgetId/stop', function(req, res){ res.send(500, 'TBD')} );
app.post('/backend/widgets/:widgetId/status', function(req, res){ res.send(500, 'TBD')} );
// a route to check if user logged in. relies on middleware to do the actual verification.
app.get('/backend/user/loggedIn', function(req, res){ res.send(managers.users.getPublicUserDetails( req.user ) );} );

//app.get('/backend/admin/users', function(req, res){ res.send('hello world!')});
app.get('/backend/admin/users', controllers.pool.readUsers);
app.post('/backend/admin/users', controllers.pool.createUsers);

var server = app.listen(9001, function(){
    console.log("Express server listening on port %d in %s mode", server.address().port, app.settings.env);
});
