'use strict';

angular.module('cloudifyWidgetUiApp')
    .factory('AccountService', function ($http) {

        function AccountService() {

            this.getPool = function (accountId) {
                return $http.get('/backend/admin/accounts/' + accountId + '/pools');
            };

        }

        return new AccountService();
    });