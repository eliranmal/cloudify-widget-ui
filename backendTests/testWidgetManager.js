var conf = require('./conf');
var cli = require('../backend/services/CloudifyCliService');
var path = require('path');
var fs = require('fs');
var logger = require('log4js').getLogger('testWidgetManager');
var managers = require('../backend/managers');
var services = require('../backend/services');


var playOpts = {};

logger.info('playing widget');

//managers.widget.play(  ,  function () {
//    logger.info('in callback')
//});


managers.widget.play( conf.playWidgetTest.widgetId, conf.playWidgetTest.poolKey, function(){
    logger.info('test success');
} )


setTimeout(function(){ logger.info('exiting')}, 10000);