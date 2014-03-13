'use strict';

angular.module('cloudifyWidgetUiApp')
    .controller('AdminUsersCtrl', function ($scope, $log, AdminService) {

        $scope.getUsers = function () {
            AdminService.getUsers().then(function (result) {
                $scope.users = result.data;
            });
        };

        $scope.createUsers = function () {
            AdminService.createUsers();
        };

    });
