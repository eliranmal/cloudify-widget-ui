var logger = require('log4js').getLogger('DbManager');
var conf = require('../Conf');
var ObjectID = require('mongodb').ObjectID;
var MongoClient = require('mongodb').MongoClient
var format = require('util').format;



exports.connect = function( collectionName, callback ){

    MongoClient.connect( conf.mongodbUrl, function(err, db) {
        if(err) throw err;

        var closed, collection = db.collection(collectionName);
        callback( db, collection, function(){
            db.close();
            closed = true;
        });
        if (!closed) {
            logger.warn('connection was not closed by callback');
            // we just want to warn at the moment, not actually close it.
            // for some reason, closing the connection here will break functionality
        }
    })
};

exports.toObjectId = function (id) {
    if (id instanceof ObjectID) {
        return id;
    }
    if (typeof id === 'string') { // this is a hex string
        return ObjectID.createFromHexString(id);
    }
    throw new Error('unable to parse ObjectID from id [' + id + ']');
};