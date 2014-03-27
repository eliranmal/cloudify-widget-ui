'use strict';

angular.module('cloudifyWidgetUiApp')
    .controller('WidgetCrudCtrl', function ($scope, $routeParams, $log, WidgetsService, $location, WidgetThemesService ) {
        $scope.clouds = [
            {
                'label': 'Softlayer',
                'id': 'softlayer'
            }
        ];


        $scope.themes = WidgetThemesService.themes;

        $scope.widget = {};
        var widgetId = $routeParams.widgetId;
        if (!!widgetId) {
            $log.info('loading widget ' + widgetId);
            WidgetsService.getWidget(widgetId).then(
                function success(data) {
                    $log.info('successfully loaded widget with id  ' + widgetId);
                    $scope.widget = data.data;
                },
                function error() {
                    $log.error('unable to load widget with id ' + widgetId);
                }
            );
        }


        function redirectToWidgets() {
            $location.path('/widgets');
        }

        $scope.delete = function(){
            WidgetsService.deleteWidget( $scope.widget);
            redirectToWidgets();
        };


        $scope.widgetAsJson = function(){
            return JSON.stringify($scope.widget, {}, 4);
        };

        $scope.view = function(){
            $scope.update().then(function(){
                $location.path('/widgets/' + $scope.widget._id + '/read');
            });
        };


        $scope.update = function () {
            return WidgetsService.updateWidget($scope.widget).then(
                function success() {
                    $log.info('successfully updated the widget');

                },
                function error() {
                    $log.error('unable to update the widget');
                }
            );
        };

        $scope.done = function(){
            redirectToWidgets();
        };

        $scope.create = function () {

            $log.info('creating new widget');

            console.log($scope.widget);
            WidgetsService.createWidget($scope.widget).then(
                function success() {
                    $log.info('successfully created widget');
                    redirectToWidgets();
                },
                function error() {
                    $log.info('error creating widget');
                }

            );
        };
    });
