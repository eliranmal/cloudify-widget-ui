'use strict';

angular.module('cloudifyWidgetUiApp')
    .directive('layout', function ( $http, $log, $location ) {
        return {
            templateUrl: 'views/loggedInLayout.html',
            transclude: true,
            restrict: 'A',
            link: function postLink(scope, element, attrs) {
                scope.logout = function(){
                    $http.post('/backend/logout').then(
                        function success(){
                            $log.info('logged out successfully');
                            $location.path('/login');
                        },
                        function error(  ){
                            $log.error('unable to logout');
                        }
                    )
                }
            }
        };
    });
