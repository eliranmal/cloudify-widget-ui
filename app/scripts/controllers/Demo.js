'use strict';

angular.module('cloudifyWidgetUiApp')
    .controller('DemoCtrl', function ($rootScope, $scope, $http) {

        if ($rootScope.user === null) {
            $http.get('/backend/user/loggedIn').then(function (data) {
                $rootScope.user = data.data;
            });
        }

    });
