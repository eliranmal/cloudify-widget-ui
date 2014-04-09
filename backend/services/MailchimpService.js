var logger = require('log4js').getLogger('CloudifyCliService');
var mailchimp = require('mailchimp');
var MailChimpAPI = mailchimp.MailChimpAPI;

function createMailChimpAPI( apiKey ){

    if ( !apiKey ){
        throw new Error('Api key is missing');
    }

    var api;
    try {
        api = new MailChimpAPI(apiKey, { version : '2.0' });
    } catch (error) {
        console.log(error.message);
        throw new Error('Unable to initilize MailChimpAPI');
    }

    return api;
}

/**
 * This method allows to associate(subscribe) new member
 * @param command, is JSON, example: { "apikey" : "Your_api_key", "id" : "Your_list_id", "email" :
            {"email": "Your_proper_mail"}, "merge_vars":{ "Email Address":"Your_proper_mail",
            "First Name":"Your First name", "Last Name":"Your Last name"} }
    Confirma mail will be send and only after confirmation new member will be assiociated/subscribed to provided list
    apiKey - taken from your mailchimp accoun
    id - lits id for new member association
 * @param callback funaction
 */
exports.subscribe = function( command, callback ){

    var api = createMailChimpAPI( command.apikey, command.id );

    api.call('lists', 'subscribe', command, function (error, data) {
        if (error)
            console.log(error.message);
        else {
            console.log('----subscribe sucessfully completed:');
            console.log(JSON.stringify(data, null, 2)); // Do something with your data!
        }
        if(callback && typeof callback === 'function' ){
            callback();
        }
    });
};

/**
 * This method allows to diassociate(unsubscribe) assiciated member
 * @param command, is JSON, example: { "apikey":"Your_api_key","id":"Your_list_id","email":{"email": "Your_proper_mail" } }
    apiKey - taken from your mailchimp accoun
    id - lits id for new member association
 * @param callback funaction
 */
exports.unsubscribe = function( command, callback ){

    var api = createMailChimpAPI( command.apikey, command.id );

    api.call('lists', 'unsubscribe', command, function (error, data) {
        if (error)
            console.log(error.message);
        else {
            console.log('----unsubscribe sucessfully completed:');
            console.log(JSON.stringify(data, null, 2)); // Do something with your data!
        }

        if(callback && typeof callback === 'function' ){
            callback();
        }
    });
};

if ( require.main === module ) {
/*
    logger.info('subscribe/add user');
    try{
//        var params =
//            '{ "apikey" : "Your_api_key", "id" : "list_id", "email" : ' +
//            '{"email": "Your_proper_email" }, ' +
//            '"merge_vars":{ "Email Address":"Your_proper_email", "First Name":"Your First name", "Last Name":"Your Last name"} }';

        logger.info('start....');
        var execConfiguration = exports.subscribe( JSON.parse(params), function(){logger.info('subscribing finished...');} );
    }catch(e){
        logger.error('error while adding new user',e);
    }
*/

/*
    logger.info('unsubscribe/remove user');
    try{
//        var params = '{ "apikey" : "Your_api_key", "id" : "list_id", "email": ' +
//            '{"email" : "Your_proper_email"}}';

        var jsonParamsObj = JSON.parse(params);
        logger.info('start....');
        var execConfiguration = exports.unsubscribe( jsonParamsObj,function(){logger.info('unsubscribing finished...');} );
    }catch(e){
        logger.error('error while adding new user',e);
    }
    */
}