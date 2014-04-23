'use strict';

angular.module('cloudifyWidgetUiApp')
    .controller('WidgetCtrl', function ($scope, WidgetsService, $log, $routeParams, PostParentService, $localStorage, $timeout, $window) {

        $scope.collapseAdvanced = false;
        $scope.widgetStatus = {};
        var play = 'RUNNING';
        var stop = 'STOPPED';
        var ellipsisIndex = 0;


        $scope.showPlay = function () {
            return $scope.widgetStatus.state === stop;
        };

        $scope.showStop = function () {
            return $scope.widgetStatus.state === play;
        };


        function _resetWidgetStatus() {
            $scope.widgetStatus = {
                'state': stop,
                'reset': true
            };
        }

        _resetWidgetStatus();

        function _hasAdvanced() {
            return false;
        }

        function _getAdvanced() {
            return null;
        }

        function _scrollLog(){
            var log = $('#log')[0];
            log.scrollTop = log.scrollHeight;
        }

        function _handleStatus( status, myTimeout ) {

            $log.info(['got status', status]);
            $localStorage.widgetStatus = status;
            ellipsisIndex = ellipsisIndex +1;
            $scope.widgetStatus = status;
            _getOutput($scope.widget);

            $timeout(_pollStatus, myTimeout || 3000);

            _scrollLog();
        }

        function _pollStatus(myTimeout) {

            if ($scope.widgetStatus.state !== stop) { // keep polling until widget stops ==> mainly for timeleft..
                WidgetsService.getStatus( $scope.widget, $scope.executionId ).then(function (result) {
                    if (!result) {
                        return;
                    }
                    _handleStatus(result.data, myTimeout);
                }, function (result) {
                    $log.error(['status error', result]);
                });
            } else {
                $log.info('removing widget status');
                delete $localStorage.widgetStatus;
            }
        }


        $scope.play = function () {
            _resetWidgetStatus();
            $scope.widgetStatus.state = play;
            var options = {advanced: _hasAdvanced() ? _getAdvanced() : null};
            if ($scope.widget.remoteBootstrap && $scope.widget.remoteBootstrap.active) {
                WidgetsService.playRemoteWidget($scope.widget, options)
                    .then(function (result) {
                        console.log(['play result', result]);
                        $scope.executionId = result.data;
                        _pollStatus(1);
                    }, function (err) {
                        console.log(['play error', err]);
                        _resetWidgetStatus('We are so hot that we ran out of instances. Please try again later.');
                    });
            }
            else {
                WidgetsService.playWidget($scope.widget, options)
                    .then(function (result) {
                        console.log(['play result', result]);
                        $scope.executionId = result.data;

                        _pollStatus(1); // TODO should be _pollExecution - this will unify all details (output, status etc.)
                    }, function (err) {
                        console.log(['play error', err]);
                        _resetWidgetStatus('We are so hot that we ran out of instances. Please try again later.');
                    });
            }
        };

        $scope.stop = function () {
            WidgetsService.stopWidget($scope.widget, $scope.executionId);
            $scope.widgetStatus.state = stop;
            _resetWidgetStatus();
        };

        var emptyList = [];

        function _getOutput (widget) {
            $log.debug('> > > get output, widget id: ', widget ? widget._id : '', ', execution id: ', $scope.executionId);

            if (!widget || !$scope.executionId) {
                $scope.output = emptyList;
            }

            WidgetsService.getOutput(widget, $scope.executionId)
                .then(function (result) {
                    $scope.output = result.data.split('\n');
                }, function (err) {
                    $log.error(err);
                });
        };


        $scope.getFormPath = function (widget) {
            if (widget.remoteBootstrap && widget.remoteBootstrap.cloudifyForm) {
                return '/views/widget/forms/' + widget.remoteBootstrap.cloudifyForm + '.html'
            }
            return '';
        };

        WidgetsService.getWidget($routeParams.widgetId).then(function (result) {
            $scope.widget = result.data;
        });

    });
