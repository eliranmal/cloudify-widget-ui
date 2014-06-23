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

                // TODO test this in this level (widget-embed)
                $timeout(function () {
                    $scope.blankIframeSrc = 'http://localhost.com:9000/#/widgets/1/blank';
                }, 1000);

//                $log.info('$scope.theme: ', $scope.theme);
//                $log.info('$scope.widget: ', $scope.widget);

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

/*

 var iframeEl = element.find('iframe');
 var iframeDomWindow = iframeEl[0].contentWindow;

                // listen to incoming messages
                iframeDomWindow.addEventListener('message', function (result) {
                    $log.info('- - - message received, user posted: ', result.data);
                    switch (result.data) {
                        case 'play':

                            // send event to call play
                            $timeout(function () {
                                scope.$broadcast('$incomingPostMessage', 'play');
                            }, 1000);

                            // emulate outgoing output response
*/
/*
                            $timeout(function () {
                                var w = findWindowByOrigin(result.origin, iframeDomWindow);
                                w.postMessage('loaded', $window.location.origin);
                            }, 1000);
*//*


                            break;
                        case 'data':
                            break;
                    }
                });
                $rootScope.apiIframeWindow = iframeDomWindow;


                */
/**
                 * traverses up the window hierarchy to find a window matching the origin address.
                 *
                 * @param origin the origin address ([protocol]://[host]:[port])
                 * @param w a window object to start the search from
                 * @returns {*}
                 *//*

                function findWindowByOrigin (origin, w) {
                    if (w.location.origin === origin) {
                        return w;
                    }
                    return findWindowByOrigin(origin, w.parent);
                }
*/

            }
        };
    });
