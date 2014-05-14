'use strict';

angular.module('cloudifyWidgetUiApp')
    .service('WidgetsService', function WidgetsService($http) {
        this.deleteWidget = function (widget) {
            if (!confirm('are you sure you want to delete ' + widget.title)) {
                return;
            }
            return $http.post('/backend/user/widgets/' + widget._id + '/delete');
        };


        this.listWidgets = function( ){
            return $http.get('/backend/user/widgets');
        };

        this.getPublicWidget = function( widgetId ){
            return $http.get('/backend/widgets/'  + widgetId);
        };

        this.getWidget = function( widgetId){
            return $http.get('/backend/user/widgets/' + widgetId);
        };

        this.createWidget = function( widget ){
            return $http.post('/backend/user/widgets', widget );
        };

        this.updateWidget = function( widget ){
            return $http.post('/backend/user/widgets/' + widget._id + '/update', widget);
        };

        this.playWidget = function( widget/*, options */ ){
            return $http.post('/backend/user/widgets/' + widget._id + '/play' );
        };

        this.playRemoteWidget = function( widget, advancedParams ){
            console.log('advancedParams', advancedParams );
            return $http.post('/backend/user/widgets/' + widget._id + '/play/remote', {data:advancedParams} );
        };

        this.stopWidget = function( widget, executionId ){
            return $http.post('/backend/user/widgets/' + widget._id + '/executions/' + executionId + '/stop');
        };

        this.getStatus = function( widget, executionId ){
            return $http.get('/backend/user/widgets/'  + widget._id + '/executions/' + executionId + '/status');
        };

        this.getOutput = function ( widget, executionId ) {
            return $http.get('/backend/user/widgets/'  + widget._id + '/executions/' + executionId + '/output');
        };
    });
