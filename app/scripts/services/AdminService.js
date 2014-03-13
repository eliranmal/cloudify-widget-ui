'use strict';

angular.module('cloudifyWidgetUiApp')
    .factory('AdminService', function ($http) {

        function AdminService() {

            this.getPools = function () {
                return $http.get('/backend/admin/pools');
            };

            this.getUsers = function () {
                return $http.get('/backend/admin/users');
            };

            this.createUser = function () {
                return $http.post('/backend/admin/users');
            };

        }

        return new AdminService();
    });