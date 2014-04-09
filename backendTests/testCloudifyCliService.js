var conf = require('./conf');
var cli = require('../backend/services/CloudifyCliService');
var path = require('path');
var fs = require('fs');
var outputDir = path.join('testOutput','example');



cli.executeCommand();