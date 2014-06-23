'use strict';

angular.module('cloudifyWidgetUiApp')
    .controller('PostMessageDemoCtrl', function ($scope, WidgetsService, $routeParams, $window, $location, $log, $timeout) {

        // using timeout only to test if deferred assignment of the url works with the iframe
        $timeout(function () {
            $scope.blankIframeSrc = 'http://localhost.com:9000/#/postmessagedemo/widgets/1/blank';
        }, 1000);

        $scope.postPlay = function () {
            _postMessage({name: 'play', widget: {_id: 'abc'}, advancedParams: {}, isRemoteBootstrap: false});
        };

        $scope.postStop = function () {
            _postMessage({name: 'stop', widget: {_id: 'abc'}, executionId: 'abc', isRemoteBootstrap: false});
        };

        function _postMessage (data) {
            $log.info('posting message to widget api frame');
//            $log.info('origin: ', $window.location.origin);
            $window.frames[0].postMessage(data, $window.location.origin);
        }

        $window.addEventListener('message', function (e) {
            $log.info('got message from widget api frame: ', e.data)
        });

    });
