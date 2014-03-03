
var conf = require('../Conf');
var MongoClient = require('mongodb').MongoClient
    , format = require('util').format;



exports.connect = function( collectionName, callback ){

    MongoClient.connect( conf.mongodbUrl, function(err, db) {
        if(err) throw err;

        var collection = db.collection(collectionName);
        callback( db, collection, function(){
            db.close();
        });
    })
};