'use strict';

angular.module('cloudifyWidgetUiApp')
    .controller('PoolsCtrl', function ($scope, $log, PoolsService) {

        $scope.getPools = function () {
            $scope.pools = PoolsService.getPools();
        }

    });