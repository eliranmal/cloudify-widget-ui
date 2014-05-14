
var logger = require('log4js').getLogger('DownloadService');
var fs = require('fs');
var path = require('path');
var https = require('https');
var http = require('http');
var AdmZip = require('adm-zip');
var files = require('./FilesService');

exports.downloadRecipe = function (options, callback) {
    try {
        var destDir = options.destDir,
            cloudifyRecipeUrl = options.recipeUrl;

        if (!destDir) {
            throw new Error('destination directory parameter is missing');
        }

        if (!cloudifyRecipeUrl) {
            throw new Error('Cloudify Recipe url parameter is missing');
        }

        logger.debug('making destination dir [' + destDir + ']');
        files.mkdirp(destDir);
        var recipeZipFile = destDir + path.sep + 'recipe.zip';

        logger.debug('fetching zip from url [' + cloudifyRecipeUrl + ']');

        var file = fs.createWriteStream(recipeZipFile);

        var protocol = http;
        if (cloudifyRecipeUrl.indexOf('https') === 0) {
            protocol = https;
        }
        protocol.get(cloudifyRecipeUrl, function (response) {
            logger.debug('saving zip');
            response.pipe(file);
            file.on('finish', function () {
                file.close();
                logger.debug('zip saved successfully [' + recipeZipFile + ']');
                var zip = new AdmZip(recipeZipFile);
                zip.extractAllTo(destDir, true);
                logger.debug('zip extracted to [' + destDir + ']');
                callback && typeof callback === 'function' && callback(null);
            });
        });
    }catch(e){
        logger.error(e);
//        callback(e);
    }
};

if (require.main === module) {

    logger.info('running main file, download recipe');
    try {
        var params = {
            destDir: "downloaded",
            cloudifyRecipeUrl: "https://dl.dropboxusercontent.com/s/u51vae4947uto0u/biginsights_solo.zip?dl=1&token_hash=AAEi1Dx3f2AFvkYXRe3FgfpspkBkQCZLLaRJb7DYHe-y1w"
        };
        logger.info('start....');
        exports.downloadRecipe(params, function () {
            logger.info('finished...');
        });

    } catch (e) {
        logger.error('error while running downloadRecipe', e);
    }
}