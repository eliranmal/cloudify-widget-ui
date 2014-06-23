'use strict';

angular.module('cloudifyWidgetUiApp')
    .controller('PostMessageDemoCtrl', function ($scope, WidgetsService, $routeParams, $window, $location, $log, $timeout) {

        $timeout(function () {
            $scope.blankIframeSrc = 'http://localhost.com:9000/#/postmessagedemo/widgets/1/blank';
        }, 1000);

        $scope.postPlay = function () {
            $log.info('posting message to widget api frame');
//            $log.info('origin: ', $window.location.origin);
            $window.frames[0].postMessage('play', $window.location.origin);
        };

        $window.addEventListener('message', function (e) {
            $log.info('got message from widget api frame: ', e.data)
        });

    });
