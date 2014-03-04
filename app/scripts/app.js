'use strict';

angular.module('cloudifyWidgetUiApp', [])
    .factory('myHttpResponseInterceptor',['$q','$location',function($q,$location){
        return {
            response: function(response){
                return promise.then(
                    function success(response) {
                        return response;
                    },
                    function error(response) {
                        if(response.status === 401){
                            $location.path('/login');
                            return $q.reject(response);
                        }
                        else{
                            return $q.reject(response);
                        }
                    });
            }
        }
    }])
    .config(function ($routeProvider, $httpProvider ) {
        $routeProvider
            .when('/demo', {
                templateUrl: 'views/demo.html',
                controller: 'DemoCtrl'
            })
            .when('/signup', {
                templateUrl: 'views/signup.html',
                controller:'SignupCtrl'
            })
            .when('/widgets', {
                templateUrl: 'views/dashboard.html',
                controller:'DashboardCtrl'
            })
            .when('/widget/:widgetId/update', {
                templateUrl: 'views/widget/update.html',
                controller: 'WidgetCrudCtrl'
            })
            .when('/widget/create', {
                templateUrl : 'views/widget/create.html',
                controller: 'WidgetCrudCtrl'
            })
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl'
            })
            .otherwise({
                redirectTo: '/demo'
            });
    });
