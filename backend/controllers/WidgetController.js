var managers = require('../managers');
var ObjectID = require('mongodb').ObjectID;

exports.list = function (req, res) {

    managers.db.connect('widgets', function (db, collection, done) {
        collection.find({userId: req.user._id}, function (err, result) {
            if (!!err) {
                res.send(500, {'message': err.message});
                done();
                return;
            } else {
                res.send(result);
                done();
                return;
            }
        })
    })
};

exports.read = function( req, res ){
    var widgetId = req.params.widgetId;
    managers.db.connect('widgets', function(db, collection, done){
       collection.findOne({'_id' : new ObjectID(widgetId), 'userId' : req.user._id }, function (err, result){
           if ( !!err ){
               res.send(500, {'message' : 'unable to find widget ' + err.message});
               done();
               return;
           }

           if ( !result ){
               res.send(404, {'message':'widget ' + widgetId + ' not found for user ' + req.user.email });
               done();
               return;
           }

           res.send(result);
           done();
           return;
       })
    });
};

function verifyRequiredField( fields, widget ){
    for ( var i in fields ){
        var field = fields[i];
        if ( !widget.hasOwnProperty(field) || widget[field].trim().length == 0 ){
            return { 'message' : field + ' is missing'};
        }

    }
}

function validateWidget( widget ){
    var errors = verifyRequiredFields( ['productName','productVersion','title','recipeName','providerUrl'], widget);
    if ( !!errors ){
        return errors;
    }
    return null;
}

exports.update = function( req, res ){
    var updatedWidget = req.body;



    if ( updatedWidget.userId != req.session.userId ){
        res.send(401, {'message' :'you do not have permissions to modify this widget'});
    }

    managers.db.connect('widgets', function(db, collection, done){
        collection.update({_id : new ObjectID(updatedWidget._id)}, updatedWidget , {}, function( err, object ){
            if ( !!err )  {
                logger.error('unable to update widget : ' + err.message);
                res.send(500, {'message' : err.message});
                done();
                return;
            }


        })
    })
};

/**
 * only exposes fields that can be exposed
 */
exports.getWidgetForPlayer = function (req, res) {
    var widgetId = req.params.widgetId;
    managers.db.connect('widgets', function (db, collection, done) {
        collection.findOne({_id: new ObjectID(widgetId)}, function (err, result) {
            if (!!err) {
                res.send(500, {'message': 'unable to get widget ' + err.message});
                done();
                return;
            }

            if ( !result ){
                res.send(500, {'message': 'widget not found with ID : ' + widgetId });
                done();
                return;
            }

            res.send( result.publicProperties );
            done();
            return;
        });
    });
};