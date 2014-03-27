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

        this.getWidget = function( widgetId){
            return $http.get('/backend/user/widgets/' + widgetId);
        };

        this.createWidget = function( widget ){
            return $http.post('/backend/user/widgets', widget );
        };

        this.updateWidget = function( widget ){
            return $http.post('/backend/user/widgets/' + widget._id + '/update', widget);
        };

        this.playWidget = function( widget/*, options */){
            return $http.post('/backend/widgets/' + widget._id + '/play');
        };

        this.stopWidget = function( widget ){
            return $http.post('/backend/widgets/' + widget._id + '/stop');
        };


        this.getStatus = function( instanceId ){
            return $http.get('/backend/widgets/'  + instanceId + '/status');
        };
    });
