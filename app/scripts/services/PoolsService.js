'use strict';

angular.module('cloudifyWidgetUiApp')
    .factory('PoolsService', function ($http, $resource) {

        function PoolsService() {

            this.getPools = function () {
                return $http.get('/backend/admin/pools');
            };

            this.getPool = function (userId) {
                return $http.get('/backend/admin/users/' + userId + '/pools');
            };

        }

        return new PoolsService();
    });