'use strict';

angular.module('cloudifyWidgetUiApp')
    .directive('poolManager', function ($rootScope) {
        return {
            restrict: 'A',
            link: function postLink(scope, element/*, attrs*/) {
                function update() {
                    if (!!$rootScope.user) {
                        if (!$rootScope.user.isPoolManager) {
                            element.remove();
                        }
                    }
                }

                $rootScope.$watch('user', function () {
                    update();
                });

            }
        };
    });
