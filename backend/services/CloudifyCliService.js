//include///
var logger = require('log4js').getLogger('CloudifyCliService');


var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;


function mkdirp( directory ){
    var outputDirPathItems = directory.split(path.sep);
    var item = '';
    for (var i = 0; i < outputDirPathItems.length; i++) {
        item = path.join(item,outputDirPathItems[i]);
        if ( !fs.existsSync (item) ){
            logger.info('creating :: ' + item);
            fs.mkdirSync(item);
        }
    }
}

/**
 * opts = {
 *  "newDir" : "new tasks directory"
 * }
 * @param opts
 * @returns {null}
 */
exports.readConfigurationFromFile = function( opts ){

    var newDir = opts.newDir;
    logger.debug(' reading execConfiguration from file', opts);
    if ( !fs.existsSync( newDir ) ){
        logger.debug( '[%s] directory does not exist. nothing to do', newDir);
        return null;
    }
    var files = fs.readdirSync( newDir );

    if ( files.length == 0 || files.indexOf('stop') >= 0 ){
        return null;
    }

    var workfile = files[0];

    if( !fs.existsSync( workfile ) ){
        fs.mkdirSync( workfile );
    }

    fs.renameSync( newDir + workfile, executingDir + workfile );

    var fileContent = fs.readFileSync( executingDir + workfile );

    return JSON.parse(fileContent);
};


exports.executeCommand = function( command ){


    var executable = command.executable;
    // converts arguments to list if it is not a list. otherwise keeps it as a list
    // http://stackoverflow.com/questions/4775722/check-if-object-is-array
    var arguments = [].concat(command.arguments);

    var logFile = command.logFile;
    mkdirp(path.dirname(logFile));

    var statusFile = command.statusFile;
    mkdirp(path.dirname(statusFile));

    if ( !executable ){
        throw new Error('exectuable is missing from command');
    }

    if ( !fs.exists(executable)){
        throw new Error('executable does not exist ::', executable);
    }

    if ( !arguments ){
        throw new Error('arguments are missing from command');
    }


    if ( !logFile ){
        throw new Error('log file is missing');
    }

    if ( !statusFile ){
        throw new Error('status file is missing');
    }

    var myCmd = spawn( 	executable, arguments );

    function appendToLogFile ( data ){
        fs.appendFile(logFile, data , function( err ) {
            if ( !!err ){
                logger.error('unable to write to log file',logFile, data.toString() , err);
            }
        });
    }

    function writeStatusJsonFile( status ){
        fs.writeFile( 'status',  JSON.stringify(status, null, 4) );
    }

    myCmd.stdout.on('data', appendToLogFile );

    myCmd.stderr.on('data', appendToLogFile );

    myCmd.on('error', function(err){writeStatusJsonFile({'error': err})});

    myCmd.on('close', function (code) { writeStatusJsonFile({'code': code})});


};


if ( require.main === module ) {
    var conf = require('../Conf');
    logger.info('running main file CloudifyCliService');
    try{
        var execConfiguration = exports.readConfigurationFromFile(conf.cloudifyCliService);
        if ( !!execConfiguration ){
            exports.executeCommand( execConfiguration );
        }
    }catch(e){
        logger.error('error while running CloudifyCliService as main',e);
    }
}