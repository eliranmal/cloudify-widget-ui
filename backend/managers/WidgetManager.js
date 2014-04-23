var logger = require('log4js').getLogger('WidgetManager');
var fs = require('fs');
var path = require('path');
var async = require('async');
var services = require('../services');
var managers = require('../managers');
var conf = require('../Conf');



exports.play = function (widgetId, poolKey, playCallback) {

    async.waterfall([

            function initCurryParams (callback) {
                var initialCurryParams = {
                    widgetId: widgetId,
                    poolKey: poolKey,
                    playCallback: playCallback
                };
                callback(null, initialCurryParams);
            },
            _getWidget,
            _createExecutionModel,
            _updateExecutionModel,
            _downloadRecipe,
            _occupyMachine,
            _runInstallCommand
        ],

        _playFinally
    );


};


exports.playRemote = function (widgetId, poolKey, playCallback) {

    logger.trace('-playRemote !!!!!!');

    async.waterfall([

            function initCurryParams (callback) {
                var initialCurryParams = {
                    widgetId: widgetId,
                    poolKey: poolKey,
                    playCallback: playCallback
                };
                callback(null, initialCurryParams);
            },
            _getWidget,
            _createExecutionModel,
            _updateExecutionModel,
            _downloadRecipe,
            _copyCloudFolder,
            _runBootstrapCommand,

        ],

        _playFinally

    );
};

exports.stop = function (executionId, callback) {
    _removeExecutionModel(executionId, callback);
};

exports.getStatus = function (executionId, callback) {

    managers.db.connect('widgetExecutions', function (db, collection, done) {
        collection.findOne({_id: managers.db.toObjectId(executionId)}, function (err, result) {

            logger.info('get status result: ', result);
            if (!!err) {
                callback(err);
                done();
                return;
            }

            if (!result) {
                callback(null, {state: 'STOPPED'});
                done();
                return;
            }

            callback(null, {state: 'RUNNING'});
            done();
        });
    });

};

exports.getOutput = function (executionId, callback) {
    _readOutputLog(executionId, callback);
};




function _getWidget(curryParams, curryCallback) {
    logger.trace('-play- getWidget');
    managers.db.connect('widgets', function (db, collection, done) {
        collection.findOne({ _id: managers.db.toObjectId(curryParams.widgetId) }, function (err, result) {
            if (!!err) {
                logger.error('unable to find widget', err);
                curryCallback(err, curryParams);
                done();
                return;
            }

            if (!result) {
                logger.error('result is null for widget find');
                curryCallback(new Error('could not find widget'), curryParams);
                done();
                return;
            }

            curryParams.widget = result;
            curryCallback(null, curryParams);
            done();
        });
    });
}

function _createExecutionModel(curryParams, curryCallback) {
    logger.trace('-play- createExecutionModel');
    managers.db.connect('widgetExecutions', function (db, collection, done) {
        // instantiate the execution model with the widget data
        collection.insert(curryParams.widget, function (err, docsInserted) {
            if (!!err) {
                logger.error('failed creating widget execution model', err);
                curryCallback(err, curryParams);
                done();
                return;
            }
            if (!docsInserted) {
                logger.error('no widget execution docs inserted to database');
                curryCallback(new Error('no widget execution docs inserted to database'), curryParams);
                done();
                return;
            }
            curryParams.executionObjectId = docsInserted[0]._id;
            curryCallback(null, curryParams);
            done();
        });
    });
}

function _updateExecutionModel (curryParams, curryCallback) {
    logger.trace('-play- updateExecutionModel');

    logger.info('execution ObjectId is [%s]', curryParams);
    // now that we have an auto generated model id, insert new fields based on it
    managers.db.connect('widgetExecutions', function (db, collection, done) {
        curryParams.executionDownloadsPath = path.join(conf.downloadsDir, curryParams.executionObjectId.toHexString());
        curryParams.executionLogsPath = path.join(conf.logsDir, curryParams.executionObjectId.toHexString());
        collection.update(
            { _id: curryParams.executionObjectId },
            {
                $set: {
                    downloadsPath: curryParams.executionDownloadsPath,
                    logsPath: curryParams.executionLogsPath
                }
            },
            function (err, nUpdated) {
                if (err) {
                    logger.error('failed updating widget execution model', err);
                    curryCallback(err, curryParams);
                    done();
                    return;
                }
                if (!nUpdated) {
                    logger.error('no widget execution docs updated in the database');
                    curryCallback(new Error('no widget execution docs updated in the database'), curryParams);
                    done();
                    return;
                }
                curryCallback(null, curryParams);
                done();
            });
    });
}

function _downloadRecipe(curryParams, curryCallback) {
    logger.trace('-play- downloadRecipe');

    // TODO : add validation if destination download not already exists otherwise simply call callback.
    logger.info('downloading recipe from ', curryParams.widget.recipeUrl);
    // download recipe zip
    var options = {
        destDir: curryParams.executionDownloadsPath,
        recipeUrl: curryParams.widget.recipeUrl
    };
    services.dl.downloadRecipe(options, function () {
        curryCallback(null, curryParams);
    });
}

function _occupyMachine(curryParams, curryCallback) {
    logger.trace('-play- occupyMachine');

    managers.poolClient.occupyPoolNode(curryParams.poolKey, curryParams.widget.poolId, function (err, result) {

        if (!!err) {
            logger.error('occupy node failed');
            curryCallback(new Error('failed to occupy node'), curryParams);
            return;
        }

        if (!result) {
            logger.error('occupy node result is null');
            curryCallback(new Error('could not occupy node, no bootstrapped nodes found'), curryParams);
            return;
        }

        try {
            curryParams.nodeModel = JSON.parse(result);
        } catch (e) {
            curryCallback(e, curryParams);
        }

        curryCallback(null, curryParams);
    });
}

function _runInstallCommand(curryParams, curryCallback) {
    logger.trace('-play- runCliCommand');

    var command = {
        arguments: [
            'connect',
            curryParams.nodeModel.machineSshDetails.publicIp,
            ';',
            curryParams.widget.recipeType.installCommand,
            path.join(curryParams.executionDownloadsPath, curryParams.widget.recipeRootPath)
        ],
        logsDir: curryParams.executionLogsPath
    };
    // we want to remove the execution model when the execution is over
    services.cloudifyCli.executeCommand(command, function (exErr, exResult) {
        if (!!exErr) {
            logger.error(exErr);
        }
        // TODO change execution status
    });

    curryCallback(null, curryParams);
}

function _copyCloudFolder( curryParams, curryCallback ){
    logger.info('copyCloudFolder, widget:', curryParams.widget );
    var cloudifyCloudsDir = conf.cloudifyCloudsDir;
    logger.info('cloudifyCloudsDir:' , cloudifyCloudsDir );
    var cloudSourceFolder = cloudifyCloudsDir + path.sep + curryParams.widget.remoteBootstrap.cloudifyCloud;
    curryParams.cloudDistFolderName = curryParams.widget.remoteBootstrap.cloudifyCloud + '_new';//TODO use here UUID generator for cloud name
    var cloudDistFolder = cloudifyCloudsDir + path.sep + curryParams.cloudDistFolderName;
    logger.info('cloudSourceFolder:', cloudSourceFolder , ', cloudDistFolder', cloudDistFolder, 'cloudDistFolderName', curryParams.cloudDistFolderName );

    var ncp = require('ncp').ncp;
    ncp.limit = 16;

    ncp(cloudSourceFolder, cloudDistFolder, function (err) {
        if( err ) {
            logger.info(err);
            return;
        }
        logger.info( 'Folder []', cloudSourceFolder, ' was successfully copied into []', cloudDistFolder );
        curryCallback(null, curryParams);
    });
}

function _runBootstrapCommand(curryParams, curryCallback) {
    logger.info('-playRemote waterfall- runCliBootstrapCommand');

    var command = {
        arguments: [
            'bootstrap-cloud',
            curryParams.cloudDistFolderName
        ]
    };

    logger.info( '-command', command );

    services.cloudifyCli.executeCommand(command);

    curryCallback(null, curryParams);
}

function _playFinally (err, curryParams) {
    logger.trace('-play- finished!');
    logger.info('result is ', curryParams);

    if (!!err) {
        logger.error('failed to play widget with id [%s]', curryParams.widgetId);
        _removeExecutionModel(curryParams.executionObjectId, curryParams.playCallback);
        curryParams.playCallback(err);
        return;
    }

    curryParams.playCallback(null, curryParams.executionObjectId.toHexString());
}




function _readOutputLog (executionId, callback) {
    _readLog(executionId, services.logs.getOutput, callback);
};

function _readStatusLog (executionId, callback) {
    _readLog(executionId, services.logs.getStatus, callback);
};


function _removeExecutionModel(executionId, callback) {
    var executionObjectId;
    try {
        // make sure it's an ObjectID and not an ID string
        executionObjectId = managers.db.toObjectId(executionId);
    } catch (e) {
        callback(e);
        return;
    }

    logger.info('removing execution model with id [%s]', executionObjectId.toHexString());
    managers.db.connect('widgetExecutions', function (db, collection, done) {
        collection.remove({ _id: executionObjectId }, function (err, result) {

            if (!!err) {
                callback(err);
                done();
                return;
            }

            if (!result) {
                callback(new Error('unable to remove execution model'));
                done();
                return;
            }

            callback(null, result);
            done();
        });
    });
}

function _readLog (executionId, logFn, callback) {
    managers.db.connect('widgetExecutions', function (db, collection, done) {
        collection.findOne({_id: managers.db.toObjectId(executionId)}, function (err, result) {

            if (!!err) {
                callback(err);
                done();
                return;
            }

            if (!result) {
                callback(new Error('unable to get log. cannot find execution model with id [' + executionId + ']'));
                done();
                return;
            }

            logFn(executionId, callback);
            done();
        });
    });
};


