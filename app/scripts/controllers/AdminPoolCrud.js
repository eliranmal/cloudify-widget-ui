'use strict';

angular.module('cloudifyWidgetUiApp')
    .controller('AdminPoolCrudCtrl', function ($scope, $log, $routeParams, $interval, AdminPoolCrudService) {

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
            angular.isDefined($scope.model.accountId) &&
                AdminPoolCrudService.getAccountPools($scope.model.accountId).then(function (result) {
                    $scope.model.accountPools = result.data;
                });
        };

        $scope.getAccountPool = function (poolId) {
            angular.isDefined($scope.model.accountId) &&
                AdminPoolCrudService.getAccountPool($scope.model.accountId, poolId).then(function (result) {
                    $scope.model.singlePool = result.data;
                });
        };

        $scope.addAccountPool = function () {
            $log.info('addAccountPool, accountId: ', $scope.model.accountId, ', newPoolSettings: ', $scope.model.newPoolSettings)
            angular.isDefined($scope.model.accountId) && angular.isDefined($scope.model.newPoolSettings) &&
                AdminPoolCrudService.addAccountPool($scope.model.accountId, $scope.model.newPoolSettings).then(function (result) {
                    $scope.getAccountPools();
                    $scope.model.newPoolSettings = '';
                });
        };

        $scope.updateAccountPool = function (editMode, pool) {
            if (editMode) {
                // save current state before user starts to edit
                $scope.model.originalPoolSettings = pool.poolSettings;
            } else if ($scope.model.originalPoolSettings !== pool.poolSettings) {
                // update with new data
                angular.isDefined($scope.model.accountId) &&
                    AdminPoolCrudService.updateAccountPool($scope.model.accountId, pool.id, pool.poolSettings).then(function (result) {
                        $scope.getAccountPools();
                    });
            }
        };

        $scope.deleteAccountPool = function (poolId) {
            $log.info('deleteAccountPool, accountId: ', $scope.model.accountId, ', poolId: ', poolId)
            angular.isDefined($scope.model.accountId) &&
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

        $scope.getMachines = function (poolId) {
            AdminPoolCrudService.getMachines(poolId).then(function (result) {
                $log.debug('got machines, result data is ', result.data);
                $scope.model.machines = result.data;
            });
        };

        $scope.addMachine = function (poolId) {
            AdminPoolCrudService.addMachine(poolId).then(function (result) {
                $log.debug('machine created, result data is ', result.data);
            });
        };

        $scope.deleteMachine = function (poolId, machineId) {
            AdminPoolCrudService.deleteMachine(poolId, machineId).then(function (result) {
                $log.debug('machine deleted, result data is ', result.data);
            });
        };

        $scope.bootstrapMachine = function (poolId, machineId) {
            AdminPoolCrudService.bootstrapMachine(poolId, machineId).then(function (result) {
                $log.debug('machine bootstrapped, result data is ', result.data);
            });
        };


        $interval(function () {
            // TODO create child controllers and separate behaviors so we wouldn't have to call every getter
            $scope.getUsers();
            $scope.getPools();
            $scope.getPoolsStatus();
            $scope.getAccountPools();
            angular.isDefined($scope.model.poolId) && $scope.getMachines($scope.model.poolId);
        }, 1000 * 5);

    });
