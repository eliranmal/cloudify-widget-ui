'use strict';

angular.module('cloudifyWidgetUiApp')
    .controller('UsersCtrl', function ($scope, $log, AdminService) {

        $scope.getUsers = function () {
            AdminService.getUsers().then(function (result) {
                $scope.users = result.data;
            });
        };

        $scope.createUser = function () {
            AdminService.createUser().then(function (result) {
                $scope.getUsers();
            });
        };

    });
