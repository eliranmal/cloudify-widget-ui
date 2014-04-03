//include///
var logger = require('log4js').getLogger('CloudifyCliService');

var fs = require('fs');
var path = require('path');
var https = require('https');
var AdmZip = require('adm-zip');

function mkdirp( directory ){
    var outputDirPathItems = directory.split(path.sep);
    logger.info('outputDirPathItems :: ' + outputDirPathItems + ', path.sep is:' + path.sep + ', outputDirPathItems length:' + outputDirPathItems.length );
    var item = '';
    for (var i = 0; i < outputDirPathItems.length; i++) {

        item = path.join(item,outputDirPathItems[i]);
        if ( !fs.existsSync (item) ){
            logger.info('creating :: ' + item);
            fs.mkdirSync(item);
        }
    }
}

exports.donwloadRecipe = function( command, callback ){

    var distDir = command.distDir;
    var cloudifyRecipeUrl = command.cloudifyRecipeUrl;

    if ( !distDir ){
        throw new Error('Distination directory parameter is missing');
    }

    if ( !cloudifyRecipeUrl ){
        throw new Error('Cloudify Recipe url parameter is missing');
    }

    logger.info('Before mkdirp [' + distDir + ']');
    mkdirp( path.dirname(distDir) );
    logger.info('After mkdirp');
    var recipeZipFile = distDir + path.sep + 'recipe.zip';

    logger.info('Before create zip from [' + cloudifyRecipeUrl + ']');

    var file = fs.createWriteStream( recipeZipFile );

    var request = https.get(cloudifyRecipeUrl, function(response) {
        logger.info('before zip save');
        response.pipe(file);
        file.on('finish', function() {
            file.close();
            logger.info('zip saved successfully [' + recipeZipFile + ']');
            var zip = new AdmZip( recipeZipFile );
            logger.info('AdmZip created for [' + recipeZipFile + ']' );
            zip.extractAllTo(distDir,true);
            logger.info('zip extracted to [' + distDir +']' );
            if(callback && typeof callback === 'function' ){
                callback();
            }
        });
    });
};

if ( require.main === module ) {

    logger.info('running main file, download recipe');
    try{
        var params = '{ "distDir": ".", "cloudifyRecipeUrl": "https://dl.dropboxusercontent.com/s/u51vae4947uto0u/biginsights_solo.zip?dl=1&token_hash=AAEi1Dx3f2AFvkYXRe3FgfpspkBkQCZLLaRJb7DYHe-y1w" }';
        logger.info('start....');
        var execConfiguration = exports.donwloadRecipe( JSON.parse(params), function(){logger.info('finished...');} );

    }catch(e){
        logger.error('error while running donwloadRecipe',e);
    }
}