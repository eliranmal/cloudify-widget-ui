'use strict';

angular.module('cloudifyWidgetUiApp')
    .controller('AdminPoolCrudCtrl', function ($scope, $log, $routeParams, AdminPoolCrudService) {

        $scope.model = {
            accountId: $routeParams['accountId'],
            poolId: $routeParams['poolId'],
            newPoolSettings: '',
            accountPools: [],
            pools: [],
            users: [],
            poolStatus: {},
            poolsStatus: {}
        };

        $scope.getUsers = function () {
            AdminPoolCrudService.getUsers().then(function (result) {
                $scope.model.users = result.data;
            });
        };

        $scope.addUser = function () {
            AdminPoolCrudService.addUser().then(function (result) {
                $scope.getUsers();
            });
        };

        $scope.getPools = function () {
            AdminPoolCrudService.getPools().then(function (result) {
                $scope.model.pools = result.data;
            });
        };

        $scope.getAccountPools = function () {
            AdminPoolCrudService.getAccountPools($scope.model.accountId).then(function (result) {
                $scope.model.accountPools = result.data;
            });
        };

        $scope.getAccountPool = function (poolId) {
            AdminPoolCrudService.getAccountPool($scope.model.accountId, poolId).then(function (result) {
                $scope.model.singlePool = result.data;
            });
        };

        $scope.addAccountPool = function () {
            $log.info('addAccountPool, accountId: ', $scope.model.accountId, ', newPoolSettings: ', $scope.model.newPoolSettings)
            if (!$scope.model.newPoolSettings) {
                return;
            }
            AdminPoolCrudService.addAccountPool($scope.model.accountId, $scope.model.newPoolSettings).then(function (result) {
                $scope.getAccountPools();
                $scope.model.newPoolSettings = '';
            });
        };

        $scope.updateAccountPool = function (editMode, pool) {
            $log.info('updateAccountPool: ', $scope.model.accountId, pool.id);
            if (editMode) {
                // save current state before user starts to edit
                $scope.model.originalPoolSettings = pool.poolSettings;
            } else if ($scope.model.originalPoolSettings !== pool.poolSettings) {
                // update with new data
                AdminPoolCrudService.updateAccountPool($scope.model.accountId, pool.id, pool.poolSettings).then(function (result) {
                    $scope.getAccountPools();
                });
            }
        };

        $scope.deleteAccountPool = function (poolId) {
            $log.info('deleteAccountPool, accountId: ', $scope.model.accountId, ', poolId: ', poolId)
            AdminPoolCrudService.deleteAccountPool($scope.model.accountId, poolId).then(function (result) {
                $scope.getAccountPools();
            });
        };

        $scope.getPoolStatus = function (poolId) {
            AdminPoolCrudService.getPoolStatus(poolId).then(function (result) {
                $log.debug('got pool detailed status ', result.data);
                $scope.model.poolStatus = result.data;
            });
        };

        $scope.getPoolsStatus = function () {
            AdminPoolCrudService.getPoolsStatus().then(function (result) {
                $log.debug('got pools general status ', result.data);
                $scope.model.poolsStatus = result.data;
            });
        };

    });
