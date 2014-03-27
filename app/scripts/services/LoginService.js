'use strict';

angular.module('cloudifyWidgetUiApp')
    .service('LoginService', function LoginService($http, $logger) {


        function _login(username, password) {
            $http.get('/backend/login', {'username': username, 'password': password}).then(
                function success() {
                    $logger.info('successfully logged in', arguments);
                },
                function error() {
                    $logger.error('unable to login', arguments);
                }
            );
        }
        this.login = _login;
    });
