'use strict';

angular.module('cloudifyWidgetUiApp')
    .factory('AdminService', function ($http, $log) {

        $log.info('initializing AdminService');
        function AdminService() {

            this.getUsers = function () {
                return $http.get('/backend/admin/users');
            };

            this.createUsers = function () {
                return $http.post('/backend/admin/users');
            };

        }

        return new AdminService();
    });