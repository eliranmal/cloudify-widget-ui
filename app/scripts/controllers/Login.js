'use strict';

angular.module('cloudifyWidgetUiApp')
    .controller('LoginCtrl', function ($scope, $log, $http, $rootScope, $location) {

        $scope.needsLogin = false;
        $http.get('/backend/user/loggedIn').then(function (/*user*/) {
            $location.path('/widgets');
        }, function () {
            $scope.needsLogin = true;
            $rootScope.pageError = '';
        });

        $scope.page = {
            'email': null,
            'password': null
        };


        $scope.login = function () {
            $scope.pageError = null;
            $http.post('/backend/login', $scope.page).then(
                function success() {
                    $log.info('successfully logged in');
                    $location.path('/widgets');
                },
                function error(result) {
                    $log.error('unable to login');
                    $scope.pageError = result.data.message;
                }
            );
        };
    });
