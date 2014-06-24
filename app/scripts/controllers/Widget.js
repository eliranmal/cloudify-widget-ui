'use strict';

angular.module('cloudifyWidgetUiApp')
    .controller('WidgetCtrl', function ($scope, LoginTypesService, WidgetsService, $log, $window, $routeParams, PostParentService, $localStorage, $timeout) {

        $log.info('loading WidgetCtrl');

        // we need to hold the running state to determine when to stop sending status/output messages back
        $scope.widgetStatus = {};
        var STATE_RUNNING = 'RUNNING';
        var STATE_STOPPED = 'STOPPED';


        function play (widget, advancedParams, isRemoteBootstrap) {

            _resetWidgetStatus();
            $scope.widgetStatus.state = STATE_RUNNING;

            WidgetsService.playWidget(widget, advancedParams, isRemoteBootstrap)
                .then(function (result) {
                    console.log(['play result', result]);
                    var executionId = result.data;
                    _postPlayed(executionId);
                    _pollStatus(1, widget, executionId);
                }, function (err) {
                    console.log(['play error', err]);
                });
        }

        function stop (widget, executionId, isRemoteBootstrap) {
            WidgetsService.stopWidget(widget, executionId, isRemoteBootstrap).then(function () {
                _postStopped(executionId);
                _resetWidgetStatus();
            });
        }

        function _resetWidgetStatus() {
            $scope.widgetStatus = {
                'state': STATE_STOPPED,
                'reset': true
            };
        }

        function _handleStatus(status, myTimeout, widget, executionId) {
            $scope.widgetStatus = status;
            _postStatus(status);
            _getOutput(widget, executionId);
            $timeout(_pollStatus.bind(this, false, widget, executionId), myTimeout || 3000);
        }

        function _pollStatus(myTimeout, widget, executionId) {

            if ($scope.widgetStatus.state !== STATE_STOPPED) { // keep polling until widget stops ==> mainly for timeleft..
                WidgetsService.getStatus(widget, executionId).then(function (result) {
                    if (!result) {
                        return;
                    }
                    _handleStatus(result.data, myTimeout, widget, executionId);
                }, function (result) {
                    $log.error(['status error', result]);
                });
            }
        }

        function _getOutput (widget, executionId) {

            WidgetsService.getOutput(widget, executionId)
                .then(function (result) {
                    var output = result.data.split('\n');
                    _postOutput(output);
                }, function (err) {
                    $log.error(err);
                });
        }


        // post outgoing messages

        function _postStatus (status) {
            _postMessage({name: 'status', data: status});
        }

        function _postOutput (output) {
            _postMessage({name: 'output', data: output});
        }

        function _postPlayed (executionId) {
            _postMessage({name: 'played', executionId: executionId});
        }

        function _postStopped (executionId) {
            _postMessage({name: 'stopped', executionId: executionId});
        }

        function _postMessage(data) {
            $window.parent.postMessage(data, /*$window.location.origin*/ '*');
        }

//        $log.debug('listening to messages on ', $window);
        // listen to incoming messages
        $window.addEventListener('message', function (e) {
            $log.info('- - - message received, user posted: ', e.data);
            if (!e.data) {
                $log.error('unable to handle posted message, no data was found');
                return;
            }
            var data = e.data;
            switch (data.name) {
                case 'play':
                    play(data.widget, data.advancedParams, data.isRemoteBootstrap);
                    break;
                case 'stop':
                    stop(data.widget, data.executionId, data.isRemoteBootstrap);
                    break;
                default:
                    break;
            }
        });

    });
