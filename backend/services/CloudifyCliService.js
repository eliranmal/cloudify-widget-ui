var logger = require('log4js').getLogger('CloudifyCliService');

var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;
var files = require('./FilesService');
var conf = require('../Conf');
var _ = require('lodash');



/**
 * @param cmd example:
 *      {
 *          executable: conf.cloudifyExecutable,
 *          arguments: ['connect', nodeModel.machineSshDetails.publicIp, ';', widget.recipeType.installCommand, path.join(downloadPath, widget.recipeRootPath) ],
 *          logFile: conf.logFile,
 *          statusFile: conf.statusFile
 *      }
 */
exports.executeCommand = function (cmd, callback) {

    var defaultOptions = {
        executable: conf.cloudifyExecutable,
        logFile: conf.logFile,
        statusFile: conf.statusFile
    };
    var command = _.extend(defaultOptions, cmd);

    var executable = command.executable;
    // converts commandArgs to list if it is not a list. otherwise keeps it as a list
    // http://stackoverflow.com/questions/4775722/check-if-object-is-array
    var commandArgs = [].concat(command.arguments);

    var logFile = command.logFile;
    files.mkdirp(path.dirname(logFile));

    var statusFile = command.statusFile;
    files.mkdirp(path.dirname(statusFile));

    if (!executable) {
        throw new Error('exectuable is missing from command');
    }

    if (!fs.existsSync(executable)) {
        throw new Error('executable does not exist ::' + executable);
    }

    if (!commandArgs) {
        throw new Error('commandArgs are missing from command');
    }


    if (!logFile) {
        throw new Error('log file is missing');
    }

    if (!statusFile) {
        throw new Error('status file is missing');
    }


    if (callback && typeof callback !== 'function') {
        throw new Error('callback must be a function');
    }


    var myCmd = spawn(executable, commandArgs);

    function appendToLogFile(data) {
        fs.appendFile(logFile, data, function (err) {
            if (!!err) {
                logger.error('unable to write to log file', logFile, data.toString(), err);
            }
        });
    }

    function writeStatusJsonFile(status) {
        fs.writeFile(statusFile, JSON.stringify(status, null, 4));
    }

    myCmd.stdout.on('data', appendToLogFile);

    myCmd.stderr.on('data', appendToLogFile);

    myCmd.on('error', function (err) {
        writeStatusJsonFile({'error': err})
    });

    myCmd.on('exit', function (code, signal) {
        logger.info('finished running command. exit code is [%s], exit signal is [%s]', code, signal);
        if (callback) {
            if (code !== 0) {
                callback(new Error('command failed with exit code [' + code + '] and exit signal [' + signal + ']'));
            } else {
                callback();
            }
        }
    });

    myCmd.on('close', function (code) {
        writeStatusJsonFile({'code': code})
    });

    logger.info('running command [%s] [%s]. log file is [%s]', executable, commandArgs, logFile);

};





/**
 * only used in main!
 *
 * opts = {
 *  "newDir" : "new tasks directory"
 * }
 * @param opts
 * @returns {null}
 */
exports.readConfigurationFromFile = function (opts) {

    var newDir = opts.newDir;
    logger.debug(' reading execConfiguration from file', opts);
    if (!fs.existsSync(newDir)) {
        logger.debug('[%s] directory does not exist. nothing to do', newDir);
        return null;
    }
    var files = fs.readdirSync(newDir);

    if (files.length == 0 || files.indexOf('stop') >= 0) {
        return null;
    }

    var workfile = files[0];

    if (!fs.existsSync(workfile)) {
        fs.mkdirSync(workfile);
    }

    fs.renameSync(newDir + workfile, executingDir + workfile);

    var fileContent = fs.readFileSync(executingDir + workfile);

    return JSON.parse(fileContent);
};


if (require.main === module) {
    var conf = require('../Conf');
    logger.info('running main file CloudifyCliService');
    try {
        var execConfiguration = exports.readConfigurationFromFile(conf.cloudifyCliService);
        if (!!execConfiguration) {
            exports.executeCommand(execConfiguration);
        }
    } catch (e) {
        logger.error('error while running CloudifyCliService as main', e);
    }
}
