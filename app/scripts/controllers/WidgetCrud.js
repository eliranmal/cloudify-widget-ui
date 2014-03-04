'use strict';

angular.module('cloudifyWidgetUiApp')
  .controller('WidgetCrudCtrl', function ($scope, $routeParams, $http, $log ) {
        var widgetId = $routeParams.widgetId;
    if ( !!widgetId ){
        $log.info('loading widget ' + widgetId );
        $http.get('/backend/user/widget/' + widgetId).then(
            function success( data ){
                $log.info('successfully loaded widget with id  ' +  widgetId );
                $scope.widget = data.data;
            },
            function error(){
                $log.error('unable to load widget with id ' + widgetId );
            }
        );

        $scope.update = function(){
            $http.post('/backend/user/widget/' + widgetId + '/edit', $scope.widget).then(
                function success(){
                    $log.info('successfully updated the widget');
                },
                function error(){
                    $log.error('unable to update the widget');
                }
            );
        };

        $scope.create = function(){
            $http.post('/backend/user/widget', $scope.widget).then(
                function success(){
                    $log.info('successfully created widget');
                },
                function error(){
                    $log.info('error creating widget');
                }

            )
        }
    }
  });
