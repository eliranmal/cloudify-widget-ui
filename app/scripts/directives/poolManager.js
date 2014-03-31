'use strict';

angular.module('cloudifyWidgetUiApp')
    .directive('poolManager', function ($rootScope) {
        return {
            restrict: 'A',
            link: function postLink(scope, element/*, attrs*/) {
                function update() {
                    if (!!$rootScope.user && !!$rootScope.user.isPoolManager) {
                        $(element).show();
                    }else{
                        $(element).hide();
                    }
                }

                $rootScope.$watch('user', function () {
                    update();
                });

            }
        };
    });
