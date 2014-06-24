'use strict';

angular.module('cloudifyWidgetUiApp')
    .directive('apiFrame', function ($window/*, $log*/) {
        return {
            template: '<iframe id="api-frame" width="0" height="0" scrolling="no" hidden="hidden" ng-src="{{getIframeSrc()}}"></iframe>',
            restrict: 'EA',
            scope: {
                widgetId: '='
            },
            controller: function ($scope) {

                $scope.getIframeSrc = function () {
                    return $window.location.origin + '/#/widgets/' + $scope.widgetId + '/blank';
                };

            }
        };
    });
