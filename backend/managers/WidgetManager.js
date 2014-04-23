var logger = require('log4js').getLogger('WidgetManager');
var fs = require('fs');
var path = require('path');
var async = require('async');
var services = require('../services');
var managers = require('../managers');
var conf = require('../Conf');


exports.play = function (widgetId, poolKey, playCallback) {

    // TODO : add different download destination per widget
    // TODO : make sure it's absolute using path.resolve()
    var downloadPath, widget, executionObjectId, nodeModel;

    async.waterfall([

            function getWidget(callback) {
                logger.trace('-play waterfall- getWidget');
                managers.db.connect('widgets', function (db, collection, done) {
                    logger.trace('-play waterfall- db.connect');
                    collection.findOne({ _id: managers.db.toObjectId(widgetId) }, function (err, result) {
                        if (!!err) {
                            logger.error('unable to find widget', err);
                            callback(err);
                            done();
                            return;
                        }

                        if (!result) {
                            logger.error('result is null for widget find');
                            callback(new Error('could not find widget'));
                            done();
                            return;
                        }

                        widget = result;
                        callback(null, result);
                        done();
                    });
                });
            },

            function createExecutionModel(result, callback) {
                logger.trace('-play waterfall- createExecutionModel');

                managers.db.connect('widgetExecutions', function (db, collection, done) {
                    // instantiate the execution model with the widget data
                    collection.insert(widget, function (err, docsInserted) {
                        if (err) {
                            logger.error('failed creating widget execution model', err);
                            callback(err);
                            done();
                            return;
                        }
                        if (!docsInserted) {
                            logger.error('no widget execution docs inserted to database');
                            callback(new Error('no widget execution docs inserted to database'));
                            done();
                            return;
                        }
                        executionObjectId = docsInserted[0]._id;
                        callback(null, executionObjectId);
                        done();
                    });
                });
            },

            function updateExecutionModel(result, callback) {
                logger.trace('-play waterfall- updateExecutionModel');

                logger.info('execution ObjectId is [%s]', result);
                // now that we have an auto generated model id, insert new fields based on it
                managers.db.connect('widgetExecutions', function (db, collection, done) {
                    downloadPath = conf.downloadDir + path.sep + result.toHexString(); // recipes are downloaded per execution
                    collection.update(
                        { _id: result },
                        { $set: { downloadPath: downloadPath } },
                        function (err, nUpdated) {
                            if (err) {
                                logger.error('failed updating widget execution model', err);
                                callback(err);
                                done();
                                return;
                            }
                            if (!nUpdated) {
                                logger.error('no widget execution docs updated in the database');
                                callback(new Error('no widget execution docs updated in the database'));
                                done();
                                return;
                            }
                            callback(null, result);
                            done();
                        });
                });
            },

            function downloadRecipe(result, callback) {
                logger.trace('-play waterfall- downloadRecipe');

                // TODO : add validation if destination download not already exists otherwise simply call callback.
                logger.info('downloading recipe from ', widget.recipeUrl);
                // download recipe zip
                var options = {
                    destDir: downloadPath,
                    recipeUrl: widget.recipeUrl
                };
                services.dl.downloadRecipe(options, function () {
                    callback(null, result);
                });
            },

            function TBDValidateRecipeExists(result, callback) {
                logger.trace('TBD - validate groovy file exists');

                // TODO - validate that -{service|application}.groovy file exists in expected location.
                callback(null, result);
            },

            function occupyMachine(result, callback) {
                logger.trace('-play waterfall- occupyMachine');

                managers.poolClient.occupyPoolNode(poolKey, widget.poolId, callback);
            },

            function handleOccupyMachine(result, callback) {
                logger.trace('-play waterfall- handleOccupyMachine');

                if (!result) {
                    logger.error('result is null for occupy node');
                    callback(new Error('could not occupy node, no bootstrapped nodes found'));
                    return;
                }

                try {
                    nodeModel = JSON.parse(result);
                } catch (e) {
                    callback(e);
                }

                callback(null, result);
            },

            function runCliCommand(result, callback) {
                logger.trace('-play waterfall- runCliCommand');

                var command = {
                    arguments: [
                        'connect',
                        nodeModel.machineSshDetails.publicIp,
                        ';',
                        widget.recipeType.installCommand,
                        path.join(downloadPath, widget.recipeRootPath)
                    ]
                };
                services.cloudifyCli.executeCommand(command);

                callback(null, executionObjectId.toHexString());
            }

        ],

        function (err, result) {
            logger.trace('-play waterfall- finished!');

            if (!!err) {
                logger.error('failed to play widget with id [%s]', widgetId);
                playCallback(err);
                return;
            }

            playCallback(null, result);
        }
    );
};


exports.playRemote = function (widgetId, poolKey, advancedParams, playCallback) {

    // TODO : add different download destination per widget
    // TODO : make sure it's absolute using path.resolve()
    var downloadPath = conf.downloadDir;
    var widget;
    var cloudDistFolder;

    logger.trace('-playRemote !!!!!! advancedParams=', advancedParams);

    async.waterfall([

            function getWidget(callback) {
                logger.trace('-playRemote waterfall- getWidget');
                managers.db.connect('widgets', function (db, collection, done) {
                    logger.trace('-playRemote waterfall- db.connect');
                    collection.findOne({ _id: managers.db.toObjectId(widgetId) }, function (err, result) {

                        logger.trace('Within findOne:', err, result );

                        if (!!err) {
                            logger.error('unable to find widget', err);
                            playCallback(err);
                            done();
                            return;
                        }

                        if (!result) {
                            logger.error('result is null for widget find');
                            playCallback(new Error('could not find widget'));
                            done();
                            return;
                        }

                        widget = result;
                        callback(null, result);
                    });
                });
            },

            function downloadRecipe(result, callback) {
                logger.trace('-play waterfall- downloadRecipe');

                // TODO : add validation if destination download not already exists otherwise simply call callback.
                logger.info('downloading recipe from ', widget.recipeUrl);
                // download recipe zip
                var options = {
                    destDir: downloadPath,
                    recipeUrl: widget.recipeUrl
                };
                services.dl.downloadRecipe(options, function () {
                    callback(null, result);
                });
            },

            function copyCloudFolder( result, callback ){
                logger.info('copyCloudFolder, widget:', widget );
                var cloudifyCloudsDir = conf.cloudifyCloudsDir;
                logger.info('cloudifyCloudsDir:' , cloudifyCloudsDir );
                var cloudName = widget.remoteBootstrap.cloudifyCloud;
                logger.info('cloudName:' , cloudName );
                var cloudSourceFolder = cloudifyCloudsDir + path.sep + cloudName;
                var suffix = getTempSuffix();
                logger.info('suffix:', suffix );
                var cloudDistFolderName = widget.remoteBootstrap.cloudifyCloud + suffix;
                cloudDistFolder = cloudifyCloudsDir + path.sep + cloudDistFolderName;
                logger.info('cloudSourceFolder:', cloudSourceFolder , ', cloudDistFolder', cloudDistFolder, 'cloudDistFolderName', cloudDistFolderName );

                var ncp = require('ncp').ncp;
                ncp.limit = 16;

                ncp(cloudSourceFolder, cloudDistFolder, function (err) {
                    if( err ) {
                        logger.info(err);
                        return;
                    }
                    logger.info( 'Folder []', cloudSourceFolder, ' was successfully copied into []', cloudDistFolder );

                    var cloudPropertiesFile = cloudDistFolder + path.sep + cloudName + '-cloud.properties';
                    logger.info( 'Cloud Properties File is ', cloudPropertiesFile, 'advancedParams=', advancedParams );

                    overrideParams( cloudDistFolderName, cloudPropertiesFile, advancedParams, callback );
                });
            },

            function runCliBootstrapCommand(cloudDistFolderName, callback) {
                logger.info('-playRemote waterfall- runCliBootstrapCommand');

                var command = {
                    arguments: [
                        'bootstrap-cloud',
                        cloudDistFolderName
                    ]
                };

                logger.info( '---command:', command );

                services.cloudifyCli.executeCommand(command);

                callback();
            }
        ],
        function (err, result) {

            logger.trace('-Remove cloud folder', cloudDistFolder );

            fs.rmdir( cloudDistFolder,  function (err, data) {
                if (!!err) {
                    logger.trace('-Failed to remove cloud folder', cloudDistFolder );
                }
                logger.trace('-Removed cloud folder', cloudDistFolder );
            });

            logger.trace('-playRemote waterfall- finished!!!' + result );

            if (!!err) {
                logger.error('failed to playRemote widget with id [%s]', widgetId);
                playCallback(err);
                return;
            }

            playCallback(null, result);
        }
    );
};

exports.getOutput = function (callback) {

    var file = conf.logFile;

    if (!file) {
        callback(new Error('unable to get output, no log file is found in configuration'));
        return;
    }

    fs.readFile(file, function (err, data) {
        if (!!err) {
            callback(err);
            return;
        }
        callback(null, data);
    });
};

function overrideParams( cloudDistFolderName, cloudPropertiesFile, advancedParams, callback){

    logger.info( '---overrideParams---, -advancedParams:', advancedParams );

    var updateLine = "";
    if( advancedParams.SOFTLAYER ){
        var username = advancedParams.SOFTLAYER.params.username;
        var apiKey = advancedParams.SOFTLAYER.params.apiKey;
        updateLine =
            'user='+ wrapWithQuotes(username) + '\n' +
            'apiKey='+ wrapWithQuotes(apiKey);
    }
    else if( advancedParams.HP ){
        var key = advancedParams.HP.params.key;
        var secretKey = advancedParams.HP.params.secretKey;
        var project = advancedParams.HP.params.project;
        updateLine =
            'tenant=' + wrapWithQuotes( project ) + '\n' +
            'user=' + wrapWithQuotes( key ) + '\n' +
            'apiKey=' + wrapWithQuotes( secretKey );
        /*
          'keyFile=' + wrapWithQuotes(newPemFile.getName() + ".pem");
          'keyPair=' + wrapWithQuotes(newPemFile.getName());
          'securityGroup=' + wrapWithQuotes(cloudConf.securityGroup);
        */
    }

    logger.info( '---updateLine', updateLine );

    fs.appendFile(cloudPropertiesFile, updateLine, function (err) {

        if (err) {
            logger.info(err);
            callback( err, cloudDistFolderName );
        }
        logger.info( 'Cloud Properties File was updated:', cloudPropertiesFile );

        callback( null, cloudDistFolderName );
    });
}

function getTempSuffix() {
    var currTime = '' + new Date().getTime();
    return currTime.substring(currTime.length - 4);
}

function wrapWithQuotes( s ){
    return "\"" + s + "\"";
}