'use strict';

angular.module('cloudifyWidgetUiApp')
    .directive('layout', function ( $http, $log, $location, $rootScope ) {
        return {
            templateUrl: 'views/loggedInLayout.html',
            transclude: true,
            restrict: 'A',
            link: function postLink(scope/*, element, attrs*/) {
                if ( !$rootScope.user ){
                    $http.get('/backend/user/loggedIn').then(function ( data ) {
                        $rootScope.user = data.data;
                    });
                }
                scope.logout = function(){
                    $rootScope.user = null;
                    $http.post('/backend/logout').then(
                        function success(){
                            $log.info('logged out successfully');
                            $location.path('/login');
                        },
                        function error(  ){
                            $log.error('unable to logout');
                        }
                    );
                };
            }
        };
    });
