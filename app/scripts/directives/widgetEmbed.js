'use strict';

angular.module('cloudifyWidgetUiApp')
    .directive('widgetEmbed', function ($log) {
        $log.info('loading');
        return {
            template: '<div><iframe style="height: {{theme.height}} ; width: {{theme.width}}" scrolling="no" ng-src="{{getIframeSrc()}}"></iframe></div>',
            restrict: 'A',
            scope: {
                'widget': '='
            },
            link: function postLink(scope, element, attrs, WidgetThemesService) {


                scope.timestamp = new Date().getTime();

                scope.getIframeSrc = function () {
                    if (!!scope.widget && !!scope.widget._id) {
                        var result = scope.getHost() + '/#/widgets/' + scope.widget._id + '/view?timestamp=' + scope.timestamp;
                        return result;
                    } else {
                        return '';
                    }
                };

                scope.$watch('widget', function () {
                    scope.timestamp = new Date().getTime();
                    if (!!scope.widget.theme) {
                        scope.theme = WidgetThemesService.getThemeById(scope.widget.theme);
                    }
                }, true);

                scope.getHost = function () {
                    return window.location.origin;
                };
            }
        };
    });
