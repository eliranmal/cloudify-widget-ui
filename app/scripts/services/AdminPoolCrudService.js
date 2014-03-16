'use strict';

angular.module('cloudifyWidgetUiApp')
    .factory('AdminPoolCrudService', function ($http) {

        function AdminPoolCrudService() {

            this.getPools = function () {
                return $http.get('/backend/admin/pools');
            };

            this.getUsers = function () {
                return $http.get('/backend/admin/users');
            };

            this.addUser = function () {
                return $http.post('/backend/admin/users');
            };

            this.getAccountPools = function (accountId) {
                return $http.get('/backend/admin/accounts/' + accountId + '/pools');
            };

            this.getAccountPool = function (accountId, poolId) {
                return $http.get('/backend/admin/accounts/' + accountId + '/pools/' + poolId);
            };

            this.addAccountPool = function (accountId, poolSettings) {
                return $http.post('/backend/admin/accounts/' + accountId + '/pools', poolSettings);
            };

            this.updateAccountPool = function (accountId, poolId, poolSettings) {
                return $http.post('/backend/admin/accounts/' + accountId + '/pools/' + poolId, poolSettings);
            };

            this.deleteAccountPool = function (accountId, poolId) {
                return $http.post('/backend/admin/accounts/' + accountId + '/pools/' + poolId + '/delete');
            };

            this.getPoolStatus = function (poolId) {
                return $http.get('/backend/admin/pools/' + poolId + '/status');
            }

            this.getPoolStatus = function () {
                return $http.get('/backend/admin/pools/status');
            }
        }

        return new AdminPoolCrudService();
    });