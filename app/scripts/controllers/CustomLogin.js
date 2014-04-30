'use strict';

angular.module('cloudifyWidgetUiApp')
  .controller('CustomLoginCtrl', function ($scope, $http, $log, $routeParams, $location ) {

        $log.info($routeParams.widgetId);
        $scope.submitForm = function(){
            $log.info('authenticating', $scope.page);
            $http.post('/backend/widgets/' + $routeParams.widgetId + '/login/custom', $scope.page).then(function( result ){
                $log.info(result);
                window.location = '/backend/widgets/' + $routeParams.widgetId + '/login/custom/callback?data=' + encodeURIComponent(JSON.stringify($scope.page));
            });
        }

  });
