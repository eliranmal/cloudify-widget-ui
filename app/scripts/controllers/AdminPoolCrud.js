'use strict';

angular.module('cloudifyWidgetUiApp')
    .controller('AdminPoolCrudCtrl', function ($scope, $log, $routeParams, $interval, AdminPoolCrudService, $rootScope) {

        $scope.model = {
            accountId: $routeParams.accountId,
            poolId: $routeParams.poolId,
            newPoolSettings: '',
            accountPools: [],
            pools: [],
            users: [],
            poolStatus: {},
            poolsStatus: {},
            nodes: []
        };

        $scope.getUsers = function () {
            AdminPoolCrudService.getUsers().then(function (result) {
                $scope.model.users = result.data;
            });
        };

        $scope.addUser = function () {
            AdminPoolCrudService.addUser().then(function (/*result*/) {
                $scope.getUsers();
            });
        };

        $scope.getPools = function () {
            AdminPoolCrudService.getPools().then(function (result) {
                $scope.model.pools = result.data;
            });
        };

        $scope.getAccountPools = function (accountId) {
            AdminPoolCrudService.getAccountPools(accountId).then(function (result) {
                $scope.model.accountPools = result.data;
            });
        };

        $scope.getAccountPool = function (accountId, poolId) {
            AdminPoolCrudService.getAccountPool(accountId, poolId).then(function (result) {
                $scope.model.singlePool = result.data;
            });
        };

        $scope.addAccountPool = function (accountId, poolSettings) {
            $log.info('addAccountPool, accountId: ', accountId, ', poolSettings: ', poolSettings);
            AdminPoolCrudService.addAccountPool(accountId, poolSettings).then(function (/*result*/) {
                $scope.getAccountPools(accountId);
                $scope.model.newPoolSettings = '';
            });
        };

        $scope.updateAccountPool = function (pool) {
            $log.info('updateAccountPool, pool: ', pool);
            // update with new data
            AdminPoolCrudService.updateAccountPool(pool.accountId, pool.id, pool.poolSettings).then(function (/*result*/) {
                $scope.getAccountPools(pool.accountId);
            });
        };

        $scope.deleteAccountPool = function (accountId, poolId) {
            $log.info('deleteAccountPool, accountId: ', accountId, ', poolId: ', poolId);
            AdminPoolCrudService.deleteAccountPool(accountId, poolId).then(function (/*result*/) {
                $scope.getAccountPools(accountId);
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

        $scope.getPoolNodes = function (poolId) {
            AdminPoolCrudService.getPoolNodes(poolId).then(function (result) {
                $log.debug('got machines, result data is ', result.data);
                $scope.model.nodes = result.data;
            });
        };

        $scope.addPoolNode = function (poolId) {
            AdminPoolCrudService.addPoolNode(poolId).then(function (result) {
                $log.debug('machine created, result data is ', result.data);
            });
        };

        $scope.deletePoolNode = function (poolId, nodeId) {
            $log.info('deletePoolNode, poolId: ', poolId, ', nodeId: ', nodeId);
            AdminPoolCrudService.deletePoolNode(poolId, nodeId).then(function (result) {
                $log.debug('machine deleted, result data is ', result.data);
            });
        };

        $scope.bootstrapPoolNode = function (poolId, nodeId) {
            $log.info('bootstrapPoolNode, poolId: ', poolId, ', nodeId: ', nodeId);
            AdminPoolCrudService.bootstrapPoolNode(poolId, nodeId).then(function (result) {
                $log.debug('machine bootstrapped, result data is ', result.data);
            });
        };

        $scope.getPoolErrors = function (poolId) {
            $log.debug('getPoolErrors, poolId: ', poolId);
            AdminPoolCrudService.getPoolErrors(poolId).then(function (result) {
                $scope.model.poolErrors = result.data;
            });
        };

        $scope.getPoolTasks = function (poolId) {
            $log.debug('getPoolTasks, poolId: ', poolId);
            AdminPoolCrudService.getPoolTasks(poolId).then(function (result) {
                $scope.model.poolTasks = result.data;
            });
        };

        $scope.getCloudNodes = function (poolId) {
            $log.debug('getCloudNodes, poolId: ', poolId);
            $scope.model.poolCloudNodes = 0;
            AdminPoolCrudService.getCloudNodes(poolId).then(function (result) {
                $scope.model.poolCloudNodes = result.data;
            });
        };

        $scope.getPoolDecisions = function (poolId) {
            $log.debug('getPoolDecisions, poolId: ', poolId);
            AdminPoolCrudService.getPoolDecisions(poolId).then(function (result) {
                $scope.model.poolDecisions = result.data;
            });
        };

        $scope.abortPoolDecision = function (poolId, decisionId) {
            $log.info('abortPoolDecision, poolId: ', poolId, ', decisionId: ', decisionId);
            AdminPoolCrudService.abortPoolDecision(poolId, decisionId).then(function (result) {
                $log.info('decision abort finished, result: ', result);
            });
        };

        $scope.updatePoolDecisionApproval = function (poolId, decision) {
            $log.info('updatePoolDecision, poolId: ', poolId, ', decisionId: ', decision.id);
            AdminPoolCrudService.updatePoolDecisionApproval(poolId, decision).then(
                function (/*result*/) {
                    $log.info('pool decision approval updated, refreshing all decisions');
                    $scope.getPoolDecisions(poolId);
                }, function (err) {
                    $log.error(err);
                });
        };


        $scope.asJson = function (jsonString) {
            return angular.fromJson(jsonString) || '';
        };


        var refreshInterval = $interval(function () {

            // TODO create child controllers and separate behaviors so we wouldn't have to call every getter

            if (!$rootScope.autoRefresh) {
                return;
            }

//            $scope.getUsers();
//            $scope.getPools();
            $log.debug('- - - refresh interval - - -');
            $scope.getPoolsStatus();
            if (angular.isDefined($scope.model.poolId)) {
                $scope.getPoolStatus($scope.model.poolId);
                $scope.getPoolNodes($scope.model.poolId);
                $scope.getPoolTasks($scope.model.poolId);
                $scope.getPoolErrors($scope.model.poolId);
                $scope.getPoolDecisions($scope.model.poolId);
            }
            if (angular.isDefined($scope.model.accountId)) {
                $scope.getAccountPools($scope.model.accountId);
            }
            if (angular.isDefined($scope.model.accountId) && angular.isDefined($scope.model.poolId)) {
                $scope.getAccountPool($scope.model.accountId, $scope.model.poolId);
            }
        }, 1000 * 5);

        $scope.$on('$destroy', function () {
            $interval.cancel(refreshInterval);
        });

    });
