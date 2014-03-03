var managers = require('../managers');


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