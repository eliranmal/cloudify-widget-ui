'use strict';

angular.module('cloudifyWidgetUiApp')
    .controller('WidgetCtrl', function ($scope, LoginTypesService, WidgetsService, $log, $window,  $routeParams, PostParentService, $localStorage, $timeout) {


/*
        $scope.$watch('widget', function (n, o, s) {
            if (n) {
                $log.info('changing blank iframe src...');
//                $scope.blankIframeSrc = $sce.trustAsResourceUrl('/#/widgets/' + $scope.widget._id + '/blank');

                $log.info(widgetFrame.frameElement);
            }
        });
*/




        // TODO extract all state related behavior to widget-theme-controllers (e.g. DefaultCtrl)

        function getStatus (widget, executionId) {

            WidgetsService.getStatus( widget, executionId ).then(function (result) {
                if (!result) {
                    return false;
                }
                $log.debug('posting status');
                _postMessage('status', result);
            }, function (result) {
                $log.error(['status error', result]);
            });
        }

        function play (widget, advancedParams, isRemoteBootstrap) {

            WidgetsService.playWidget(widget, advancedParams, isRemoteBootstrap)
                .then(function (result) {
                    console.log(['play result', result]);
                    var executionId = result.data;
                    getStatus(widget, executionId);
                }, function (err) {
                    console.log(['play error', err]);
                });
        }

        function stop (widget, executionId, isRemoteBootstrap) {
            WidgetsService.stopWidget(widget, executionId, isRemoteBootstrap).then(function () {
                // todo return success event
            });
        }

        function getOutput (widget, executionId) {

            WidgetsService.getOutput(widget, executionId)
                .then(function (result) {
                    return result.data.split('\n');
                }, function (err) {
                    $log.error(err);
                });
        }


        // post outgoing messages
        function _postMessage(name, data) {
            $window.parent.postMessage({name: name, data: data}, $window.location.origin);
        }

//        $log.debug('listening to messages on ', $window);
        // listen to incoming messages
        $window.addEventListener('message', function (result) {
            $log.info('- - - message received, user posted: ', result.data);
            if (!result.data) {
                $log.error('unable to handle posted message, no data was found');
                return;
            }
            var data = result.data;
            switch (data.name) {
                case 'play':
                    play(data.widget, data.advancedParams, data.isRemoteBootstrap);
                    break;
                case 'stop':
                    stop(data.widget, data.executionId, data.isRemoteBootstrap);
                    break;
                case 'getOutput':
                    getOutput(data.widget, data.executionId);
                    break;
            }
        });

    });
