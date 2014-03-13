'use strict';

angular.module('cloudifyWidgetUiApp')
    .factory('UsersService', function ($http) {

        function UsersService() {

            this.getUsers = function () {
                return $http.get('/backend/admin/users');
            };

            this.createUser = function () {
                return $http.post('/backend/admin/users');
            };

        }

        return new UsersService();
    });