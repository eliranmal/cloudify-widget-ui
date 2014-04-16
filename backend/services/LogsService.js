var logger = require('log4js').getLogger('LogsService');

var fs = require('fs');
var path = require('path');
var conf = require('../Conf');
var files = require('../services/FilesService');


exports.getOutput = function (executionId, callback) {
    logger.info('getting output with execution id [%s]', executionId);
    var path = _getExecutionOutputFilePath(executionId);
    logger.info('output file path is [%s]', path);
    _getContents(path, callback);
};


exports.getStatus = function (executionId, callback) {
    logger.info('getting status with execution id [%s]', executionId);
    var path = _getExecutionStatusFilePath(executionId);
    logger.info('status file path is [%s]', path);
    _getContents(path, callback);
};

function _getContents(path, callback) {
    logger.info('getting file contents for path [%s]', path);

    if (!path) {
        callback(new Error('unable to get output, cannot build log file path'));
        return;
    }

    if (!fs.existsSync(path)) {
        callback(new Error('unable to read contents, file does not exist'));
        return;
    }

    fs.readFile(path, function (err, data) {
        if (!!err) {
            callback(err);
            return;
        }
        callback(null, data);
    });
};

function _getExecutionOutputFilePath(executionId) {
    return executionId ? path.join(conf.logsDir, executionId, 'output.log') : '';
};

function _getExecutionStatusFilePath(executionId) {
    return executionId ? path.join(conf.logsDir, executionId, 'status.log') : '';
};

