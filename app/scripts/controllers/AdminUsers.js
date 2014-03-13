'use strict';

angular.module('cloudifyWidgetUiApp')
    .controller('AdminUsersCtrl', function ($scope, $log, AdminService) {

        $scope.foo = 'bar';

        $scope.getUsers = function () {
            $scope.users = [
                {
                    uuid: 'a'
                },
                {
                    uuid: 'b'
                },
                {
                    uuid: 'c'
                }
            ];
            AdminService.users().then(function ( result ) {
                $scope.model = { users : result.data };
            });
/*
            AdminService.users().then(function (data) {
                $scope.users = data;
            });
*/
        };

        $scope.createUser = function () {
            $log.info('creating new user');
//            AdminService.createUser();
        };

    });
