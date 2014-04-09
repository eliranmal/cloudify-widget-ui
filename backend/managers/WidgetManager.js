var logger = require('log4js').getLogger('WidgetManager'),
    path = require('path'),
    async = require('async'),
    services = require('../services'),
    managers = require('../managers'),
    conf = require('../Conf');


exports.play = function (widgetId, poolKey, playCallback) {

    // TODO : add different download destination per widget
    // TODO : make sure it's absolute using path.resolve()
    var downloadPath = conf.downloadDir;
    var widget, nodeModel;

    async.waterfall([

            function getWidget(callback) {
                logger.trace('-play waterfall- getWidget');
                managers.db.connect('widgets', function (db, collection, done) {
                    logger.trace('-play waterfall- db.connect');
                    collection.findOne({ _id: managers.db.toObjectId(widgetId) }, function (err, result) {
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

            function TBDValidateRecipeExists(result, callback) {
                logger.trace('TBD - vlaidating groovy file exists');

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
                    playCallback(new Error('could not occupy node'));
                    return;
                }
                nodeModel = JSON.parse(result);

                callback();
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
            }

        ],


        function (err, result) {
            logger.info('waterfall is done!');

            if (!!err) {
                logger.error('failed to play widget with id [%s]', widgetId);
                playCallback(err);
                return;
            }
        }
    );

};
