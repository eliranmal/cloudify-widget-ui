'use strict';

angular.module('cloudifyWidgetUiApp')
    .controller('AccountPoolsCtrl', function ($scope, $log, AccountService, $route) {

        $scope.accountId = $route.current.params['accountId'];

        $scope.getPool = function () {
            AccountService.getPool($scope.accountId).then(function (result) {
                $scope.pools = result.data;
            });
        }

    });