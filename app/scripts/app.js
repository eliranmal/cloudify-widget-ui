'use strict';

angular.module('cloudifyWidgetUiApp', ['ngCookies', 'ngRoute', 'ngStorage', 'ngResource'])
// register the interceptor as a service
    .factory('myHttpInterceptor', function ($q, $rootScope, $location) {
        var $scope = $rootScope;
        return {
            // optional method
            'request': function (config) {
                $scope.pageError = null;
                $scope.ajaxRequestInProgress = true;
                // do something on success
                return config || $q.when(config);
            },

            // optional method
            'requestError': function (rejection) {
                if ( rejection.hasOwnProperty('data') && rejection.data.hasOwnProperty('message')){
                    $scope.pageError = rejection.data.message;
                }
                $scope.ajaxRequestInProgress = false;
                // do something on error

                return $q.reject(rejection);
            },


            // optional method
            'response': function (response) {

                if (response.status == 401) {
                    $location.path('/login')
                } else if (response.status == 500 && response.data.hasOwnProperty('message')) {
                    $scope.pageError = response.data.message;
                }

                $scope.ajaxRequestInProgress = false;
                // do something on success
                return response || $q.when(response);
            },

            // optional method
            'responseError': function (rejection) {
                if ( rejection.hasOwnProperty('data') && rejection.data.hasOwnProperty('message')){
                    $scope.pageError = rejection.data.message;
                }
                $scope.ajaxRequestInProgress = false;
                return $q.reject(rejection);
            }
        };
    })
    .config(function ($routeProvider, $httpProvider) {
        $routeProvider
            .when('/demo', {
                templateUrl: 'views/demo.html',
                controller: 'DemoCtrl'
            })
            .when('/dashboard', {
                templateUrl: 'views/dashboard.html',
                controller: 'DashboardCtrl'
            })
            .when('/signup', {
                templateUrl: 'views/signup.html',
                controller: 'SignupCtrl'
            })
            .when('/admin/users', {
                templateUrl: 'views/admin/users.html',
                controller: 'AdminUsersCtrl'
            })
            .when('/widgets', {
                templateUrl: 'views/dashboard.html',
                controller: 'DashboardCtrl'
            })
            .when('/widgets/:widgetId/read', {
                templateUrl: 'views/widget/read.html',
                controller: 'WidgetCrudCtrl'
            })
            .when('/widgets/:widgetId/update', {
                templateUrl: 'views/widget/update.html',
                controller: 'WidgetCrudCtrl'
            })
            .when('/widgets/create', {
                templateUrl: 'views/widget/create.html',
                controller: 'WidgetCrudCtrl'
            })
            .when('/widgets/:widgetId/view',{
                templateUrl: 'views/widget/themes/widgetView.html',
                controller: 'WidgetViewCtrl'
            })
            .when('/widgets/:widgetId/embed',{
                templateUrl: 'views/widget/themes/widgetEmbed.html',
                controller: 'WidgetEmbedCtrl'
            })
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl'
            })
            .otherwise({
                redirectTo: '/demo'
            });

        $httpProvider.interceptors.push('myHttpInterceptor');
    });
