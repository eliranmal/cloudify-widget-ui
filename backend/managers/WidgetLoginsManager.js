var dbManager = require('./DbManager');
var widgetManager = require('./WidgetManager');
var mailchimpService = require('../services/MailchimpService');
var logger = require('log4js').getLogger('WidgetLoginsManager');

exports.saveLoginToDb = function (loginId, loginData, callback) {

    var correct_loginDetails = {};

    // must remove dots from strings
    for (var i in loginData.loginDetails) {
        if (loginData.loginDetails.hasOwnProperty(i)) {
            var correct_i = i.replace(/\./g, '_');
            correct_loginDetails[correct_i] = loginData.loginDetails[i];
        }
    }

    loginData.loginDetails = correct_loginDetails;


    dbManager.connect(loginId + 'WidgetLogin', function (db, collection, done) {

        collection.findOne({ 'uid': loginData.uid, 'widgetId': loginData.widgetId  }, function (err, result) {
            if (!!err) {
                logger.error('unable to determine if ', loginId, ' already exists due to an error', err);
                done();
                return;
            }
            if (!!result) {
                logger.info(loginId, 'login already exists. ignoring', loginData.uid);
                callback(null, loginData);
                done();
                return;
            }

            collection.insert(loginData, function (err, obj) {
                if (!!err) {
                    logger.error('unable to save login details due to an error', err);
                    done();
                    return;
                }
                done();
                callback(null, obj);


            })
        })

    });
};

/**
 * loginId = 'google' or 'custom' etc..
 */
exports.getWidgetLogins = function (userId, loginId, callback) {
    dbManager.connect(loginId + 'WidgetLogin', function (db, collection, done) {
        collection.find({ 'userId': userId }).toArray(function (err, result) {
            callback(err, { 'loginId': loginId, 'data': result });
        })
    })
};


/**
 * [
 *     {   'loginId' : 'google' , 'data' : [ .... ] }.
 *     {   'loginId' : 'twitter', 'data' : [ .... ] }
 *
 * ]
 * @param userId
 * @param callback
 */

exports.getAllWidgetLogins = function (userId, callback) {

    var functions = [];
    var result = [];
    var loginsIds = [ 'google', 'twitter' ];
    loginsIds.forEach(function (loginId) {

        var _func = function () {
            exports.getWidgetLogins(userId, loginId, function (err, result) {
                if (!!err) {
                    logger.error('unable to get logins for ', loginId);
                    return;
                }
                result.push(result);
            })
        };

        functions.push(_func);

    });

    async.parallel(functions, function (err) {
        callback(err, result)
    });

};

function _getLoginHandler(widget, handler) {
    if (widget.hasOwnProperty('socialLogin') &&
        widget.socialLogin.hasOwnProperty('handlers') &&
        widget.socialLogin.handlers.hasOwnProperty(handler)) {
        return widget.socialLogin.handlers[handler];
    }

}


function _sendToMailchimp(widget, mailchimpLoginDetails) {
    var handler = _getLoginHandler(widget, 'mailchimp');
    if (!!handler && !!handler.enabled) {
        logger.info('sending to mailchimp');

        mailchimpService.subscribe(
            { "apikey": handler.apiKey,
                'update_existing' : true,
                "id": handler.listId,
                "email": { 'email' : mailchimpLoginDetails.email },

                "merge_vars": {
                    "NAME": mailchimpLoginDetails.NAME,
                    "LASTNAME": mailchimpLoginDetails.LASTNAME
                }
            });


    } else {
        logger.info('handler mailchimp does not exist. ignoring');
    }

}

exports.handleGoogleLogin = function (widgetId, loginDetails, callback) {


    widgetManager.findById(widgetId, function (err, widget) {
        if (!!err) { // NOTE : do not return error response here. it does not matter to the users. it is our bug and we should overcome it.
            callback(new Error('unable to find widget due to error ', err));
            return;
        }

        if (!widget) {
            callback(new Error('widget does not exist ', widgetId));
            return;
        }

        exports.saveLoginToDb('google', {  'timestamp': new Date().getTime(), 'widgetId': widget._id, 'userId': widget.userId, 'uid': loginDetails['openid.ext1.value.email'], 'loginDetails': loginDetails }, callback);
        _sendToMailchimp(widget, { 'NAME': loginDetails['openid.ext1.value.firstname'], 'LASTNAME': loginDetails['openid.ext1.value.lastname'], 'email': loginDetails['openid.ext1.value.email']});
    });
};