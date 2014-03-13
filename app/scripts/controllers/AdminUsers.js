'use strict';

angular.module('cloudifyWidgetUiApp')
    .controller('AdminUsersCtrl', function ($scope, AdminService) {

        $scope.foo = 'bar';

        AdminService.users().then(function () {
            console.log('yyayyyyyay')
        });
    });
