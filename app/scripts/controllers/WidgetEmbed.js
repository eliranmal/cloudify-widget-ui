'use strict';

angular.module('cloudifyWidgetUiApp')
    .controller('WidgetEmbedCtrl', function ($scope, WidgetsService, $routeParams/*, $window*/, $log) {

        WidgetsService.getWidget($routeParams.widgetId).then(function (result) {
            $scope.widget = result;
        });

    });
