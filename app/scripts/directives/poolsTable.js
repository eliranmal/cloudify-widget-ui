'use strict';

angular.module('cloudifyWidgetUiApp')
    .directive('poolsTable', function () {
        return {
            restrict: 'EA',
            templateUrl: 'views/poolsTable.html',
            scope: {
                pools: '=ngModel',
                updateAccountPool: '=updateFn',
                deleteAccountPool: '=deleteFn'
            }
        };
    });
