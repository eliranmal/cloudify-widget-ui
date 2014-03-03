'use strict';

angular.module('cloudifyWidgetUiApp')
  .controller('SignupCtrl', function ($scope, $http , $log, $location ) {
        $scope.userSignup = {};
        $scope.pageError = null;

        $scope.signup = function(){
            $scope.pageError = null;
            $http.post('/backend/signup', $scope.userSignup).then(
                function success () {
                    $log.info('user signed up');
                    $location.path('/login');
                },
                function error( result ) {
                    $log.error('error while signing up');
                    $scope.pageError = result.data.message;
                }
            )
        }
  });
