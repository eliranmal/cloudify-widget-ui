'use strict';

angular.module('cloudifyWidgetUiApp')
    .controller('WidgetViewCtrl', function ($scope, WidgetsService, $routeParams) {

        WidgetsService.getWidget($routeParams.widgetId).then(function (result) {
            $scope.widget = result;
        });


        $scope.getInclude = function () {
            if (!$scope.widget) {
                return '';
            } else {
                var widgetTheme = $scope.widget.theme || 'default';
                return 'views/widget/themes/' + widgetTheme + '.html';
            }
        };
    });
