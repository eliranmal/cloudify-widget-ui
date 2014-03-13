'use strict';

angular.module('cloudifyWidgetUiApp')
    .factory('PoolsService', function ($http, $log) {

        function AdminService() {

            this.getPools = function () {
                return $http.get('/backend/admin/pools');
            };

            this.createPool = function () {
                return $http.post('/backend/admin/pools');
            };

        }

        return new AdminService();
    });