'use strict';

angular.module('cloudifyWidgetUiApp')
    .controller('PoolsCtrl', function ($scope, $log, AdminService) {

        $scope.getPools = function () {
            AdminService.getPools().then(function (result) {
                $scope.pools = result.data;
            });
        };

    });
