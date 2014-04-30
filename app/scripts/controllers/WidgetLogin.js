'use strict';

angular.module('cloudifyWidgetUiApp')
  .controller('WidgetLoginCtrl', function ($scope, $routeParams, WidgetsService, LoginTypesService, $log ) {

        WidgetsService.getPublicWidget($routeParams.widgetId).then(function (result) {
            $scope.widget = result.data;
        });

        $scope.loginTypes = function( ids ){
            if ( !ids ){
                return [];
            }
            var result = [];
            for ( var i  = 0; i < ids.length ; i ++){
                result.push(LoginTypesService.getById(ids[i].id));
            }
            return result;
        }
  });
