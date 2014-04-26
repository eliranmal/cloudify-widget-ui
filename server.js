/**
 * Module dependencies.
 */

var express = require('express')
    , controllers = require('./backend/controllers')
    , logger = require('log4js').getLogger('server')
    , managers = require('./backend/managers')
    , middleware = require('./backend/middleware');

var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var errorHandler = require('errorhandler');


var app = module.exports = express();

// Configuration
var conf = require('./backend/Conf');
logger.info(JSON.stringify(conf));

if ( !!conf.adminUser ){
    conf.adminUser.passwordConfirm = conf.adminUser.password;
    conf.adminUser.firstName = 'admin';
    conf.adminUser.lastName = 'admin';
    conf.adminUser.poolKey = conf.adminUser.poolKey;
    conf.adminUser.isAdmin = true;
    managers.users.createUser(conf.adminUser, function(err, user){
        if ( !!err && err.indexOf('exists') < 0 ){
            logger.error('unable to create admin user ' + err);
        }else{
            logger.info('admin user created successfully');
        }
    })
}


app.use(middleware.requestInfo.origin);
app.use(bodyParser());
app.use(methodOverride());
app.use(cookieParser());
logger.info('configuring express');
app.use(cookieSession({ 'secret': 'somesecret' }));
app.use('/backend/user', middleware.session.loggedUser);
app.use('/backend/admin', middleware.session.loggedUser);
app.use('/backend/admin', middleware.session.adminUser);


//app.use(function( err ){
//    logger.error('using error handler', err);
//});
app.all('*',errorHandler({ dumpExceptions: true, showStack: true }));

// Routes

app.post('/backend/signup', controllers.session.signup);
app.post('/backend/login', controllers.session.login );
app.post('/backend/logout', controllers.session.logout);
app.get('/backend/user/widgets', controllers.widgets.list);
app.post('/backend/user/widgets', controllers.widgets.create);
app.post('/backend/user/widgets/:widgetId/delete', controllers.widgets.delete);
app.get('/backend/user/widgets/:widgetId', controllers.widgets.read);
app.post('/backend/user/widgets/:widgetId/update', controllers.widgets.update);
app.post('/backend/user/widgets/:widgetId/play', function(req, res, next){ next( new Error('guy') ); /*try{controllers.widgets.play(req, res)}catch(e){ logger.info('excepton caught'); next(e); }*/});
app.post('/backend/user/widgets/:widgetId/play/remote', controllers.widgets.playRemote);
app.post('/backend/user/widgets/:widgetId/executions/:executionId/stop', controllers.widgets.stop );
app.get('/backend/user/widgets/:widgetId/executions/:executionId/status', controllers.widgets.getStatus );
app.get('/backend/user/widgets/:widgetId/executions/:executionId/output', controllers.widgets.getOutput);
// a route to check if user logged in. relies on middleware to do the actual verification.
app.get('/backend/user/loggedIn', function(req, res){ res.send(managers.users.getPublicUserDetails( req.user ) );} );

//app.get('/backend/admin/users', function(req, res){ res.send('hello world!')});
app.get('/backend/admin/users', controllers.pool.readUsers);
app.post('/backend/admin/users', controllers.pool.createUsers);
app.get('/backend/admin/pools', controllers.pool.adminReadPools);

app.get('/backend/admin/accounts/:accountId/pools', controllers.pool.adminReadAccountPools);
app.post('/backend/admin/accounts/:accountId/pools', controllers.pool.createAccountPools);
app.post('/backend/admin/accounts/:accountId/pools/:poolId', controllers.pool.updateAccountPools);
app.post('/backend/admin/accounts/:accountId/pools/:poolId/delete', controllers.pool.deleteAccountPools);
app.get('/backend/admin/accounts/:accountId/pools/:poolId', controllers.pool.adminReadAccountPool);

app.get('/backend/admin/pools/status', controllers.pool.readPoolsStatus);
app.get('/backend/admin/pools/:poolId/status', controllers.pool.readPoolStatus);

app.get('/backend/admin/pools/:poolId/nodes', controllers.pool.readPoolNodes);
app.post('/backend/admin/pools/:poolId/nodes', controllers.pool.createPoolNode);
app.post('/backend/admin/pools/:poolId/nodes/:nodeId/delete', controllers.pool.deletePoolNode);
app.post('/backend/admin/pools/:poolId/nodes/:nodeId/bootstrap', controllers.pool.bootstrapPoolNode);

app.get('/backend/admin/pools/:poolId/errors', controllers.pool.readPoolErrors);
app.get('/backend/admin/pools/:poolId/tasks', controllers.pool.readPoolTasks);
app.get('/backend/admin/pools/:poolId/tasks/:taskId/delete', controllers.pool.deletePoolTask);

app.get('/backend/admin/pools/:poolId/cloud/nodes', controllers.pool.readCloudNodes);

app.get('/backend/user/account/pools', controllers.pool.accountReadPools );
app.post('/backend/user/account/pools', controllers.pool.createPool);
app.post('/backend/user/account/pools/:poolId', controllers.pool.updatePool);
app.post('/backend/user/account/pools/:poolId/delete', controllers.pool.deletePool);
app.get('/backend/user/account/pools/:poolId/status', controllers.pool.accountReadPoolStatus);
app.get('/backend/user/account/pools/status', controllers.pool.accountReadPoolsStatus);


app.get('/backend/widgets/:widgetId', controllers.widgets.getPublicInfo);
app.get('/backend/widgets/:widgetId/login/google', controllers.widgetLogin.googleLogin);
app.get('/backend/widgets/:widgetId/login/google/callback', controllers.widgetLogin.googleLoginCallback);
app.get('/backend/widgets/:widgetId/login/linkedin', controllers.widgetLogin.linkedInLogin);
app.get('/backend/widgets/:widgetId/login/linkedin/callback', controllers.widgetLogin.linkedInLoginCallback);
app.get('/backend/widgets/:widgetId/login/twitter', controllers.widgetLogin.twitterLogin);
app.get('/backend/widgets/:widgetId/login/twitter/callback', controllers.widgetLogin.twitterLoginCallback);







var widgetPort = process.argv[2] || 9001;


var server = app.listen(widgetPort, function(){
    logger.info("Express server listening on port %d in %s mode", server.address().port, app.settings.env);
});

//process.on('uncaughtException', function(){
//    logger.error('an error has occurred', arguments);
//});
