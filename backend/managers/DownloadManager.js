
var logger = require('log4js').getLogger('DownloadManager'),
    services = require('../services');

/**
 * @param options "{ distDir: String, cloudifyRecipeUrl: String }"
 * @param callback
 */
exports.downloadRecipe = function (options, callback) {
    services.dl.downloadRecipe(options, callback);
};
