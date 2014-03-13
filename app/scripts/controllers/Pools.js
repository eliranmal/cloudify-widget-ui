'use strict';

angular.module('cloudifyWidgetUiApp')
    .controller('PoolsCtrl', function ($scope, $log, PoolsService) {

        $scope.getPools = function () {
            PoolsService.getPools().then(function (result) {
                $scope.pools = result.data;
            });
        }

    });