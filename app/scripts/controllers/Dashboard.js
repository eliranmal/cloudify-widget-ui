'use strict';

angular.module('cloudifyWidgetUiApp')
  .controller('DashboardCtrl', function ($scope, $http, $log ) {
        $http.get('/backend/user/widgets',
            function success( result ){
                $log.info('got widgets successfully');
                $scope.widgets = result.data;
            },
            function error( result ){
                $log.error('unable to get widgets');
                $scope.pageError = result.data.message;

            }
        )
  });
