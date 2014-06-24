'use strict';

angular.module('cloudifyWidgetUiApp')
    .directive('widgetEmbed', function (WidgetThemesService, TextContentCompiler, $rootScope, $log, $timeout, $window) {
        return {
            // for example <iframe .... src="http://localhost.com:9000/widgets/WIDGET_ID/view"></iframe>
            template: '<iframe width="{{getIframeWidth()}}" height="{{getIframeHeight()}}" scrolling="no" ng-src="{{getIframeSrc()}}"></iframe>',
            restrict: 'A',
            scope: {
                'widget': '=',
                'theme': '='
            },
            controller: function ($scope, $element) {

                $scope.timestamp = new Date().getTime();

                $scope.getIframeWidth = function () {
                    if ($scope.theme) {
                        return $scope.theme.width;
                    }
                    return '';
                };

                $scope.getIframeHeight = function () {
                    if ($scope.theme) {
                        return $scope.theme.height;
                    }
                    return '';
                };

                $scope.getIframeSrc = function () {
                    if (!!$scope.widget && !!$scope.widget._id) {
                        return $scope.getHost() + '/#/widgets/' + $scope.widget._id + '/view?timestamp=' + $scope.timestamp;
                    }
                    return '';
                };

                $scope.$watch('widget', function () {
                    $scope.timestamp = new Date().getTime();
                    if (!!$scope.widget.theme) {
                        $scope.theme = WidgetThemesService.getThemeById($scope.widget.theme);
                    }
                }, true);

                $scope.getHost = function () {
                    return $window.location.origin;
                };

                $scope.compileToText = function () {
                    TextContentCompiler.asText($scope, $element, 'iframe', ['ng-src']);
                };

            },
            link: function postLink(scope, element, attrs) {

                if (attrs.asCode) {
                    scope.compileToText();
                }
            }
        };
    });
