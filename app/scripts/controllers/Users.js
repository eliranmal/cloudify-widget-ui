'use strict';

angular.module('cloudifyWidgetUiApp')
    .controller('UsersCtrl', function ($scope, $log, UsersService) {

        $scope.getUsers = function () {
            UsersService.getUsers().then(function (result) {
                $scope.users = result.data;
            });
        };

        $scope.createUser = function () {
            UsersService.createUser().then(function (result) {
                $scope.getUsers();
            });
        };

    });
