var logger = require('log4js').getLogger('LogsService');

var path = require('path');
var conf = require('../Conf');


exports.getOutput = function (executionId, callback) {
    var file = _getExecutionOutputFilePath(executionId);
    _getContents(file, callback);
};


exports.getStatus = function (executionId, callback) {
    var file = _getExecutionStatusFilePath(executionId);
    _getContents(file, callback);
};

function _getContents(file, callback) {

    if (!file) {
        callback(new Error('unable to get output, cannot build log file path'));
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

function _getExecutionOutputFilePath(executionId) {
    return executionId ? path.join(conf.logsDir, executionId, 'output.log') : '';
};

function _getExecutionStatusFilePath(executionId) {
    return executionId ? path.join(conf.logsDir, executionId, 'status.log') : '';
};

