
var logger = require('log4js').getLogger('DownloadRecipeService'),
    fs = require('fs'),
    path = require('path'),
    https = require('https'),
    http = require('http'),
    AdmZip = require('adm-zip'),
    files = require('./FilesService');

exports.downloadRecipe = function (options, callback) {

    var destDir = options.destDir,
        cloudifyRecipeUrl = options.recipeUrl;

    if (!destDir) {
        throw new Error('destination directory parameter is missing');
    }

    if (!cloudifyRecipeUrl) {
        throw new Error('Cloudify Recipe url parameter is missing');
    }

    logger.info('making destination dir [' + destDir + ']');
    files.mkdirp(destDir);
    var recipeZipFile = destDir + path.sep + 'recipe.zip';

    logger.info('fetching zip from url [' + cloudifyRecipeUrl + ']');

    var file = fs.createWriteStream(recipeZipFile);

    var protocol = http;
    if ( cloudifyRecipeUrl.indexOf('https') === 0 ){
        protocol = https;
    }
    protocol.get(cloudifyRecipeUrl, function (response) {
        logger.info('saving zip');
        response.pipe(file);
        file.on('finish', function () {
            file.close();
            logger.info('zip saved successfully [' + recipeZipFile + ']');
            var zip = new AdmZip(recipeZipFile);
            zip.extractAllTo(destDir, true);
            logger.info('zip extracted to [' + destDir + ']');
            callback && typeof callback === 'function' && callback(null);
        });
    });
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