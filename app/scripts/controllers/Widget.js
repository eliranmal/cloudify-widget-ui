'use strict';

angular.module('cloudifyWidgetUiApp')
    .controller('WidgetCtrl', function ($scope, LoginTypesService, WidgetsService, $log, $window,  $routeParams, PostParentService, $localStorage, $timeout) {

        $window.$windowScope = $scope;

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
            return $scope.advancedParams;
        }

        function _getAdvanced() {
            return $scope.advancedParams;
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

        // use this with the following from the popup window:
        //
        $scope.loginDone = function( ){
            $log.info('login is done');
            if ( popupWindow !== null ){
                popupWindow.close();
                popupWindow = null;
            }

            $scope.loginDetails = {};   // we will verify this in the backend
            $timeout(function(){$scope.play();}, 0);
        };

        var popupWindow = null;
        $scope.play = function () {

            if ( !!$scope.widget.socialLogin && !!$scope.widget.socialLogin.data  && $scope.widget.socialLogin.data.length > 0 && !$scope.loginDetails ){

                var size = LoginTypesService.getIndexSize();

                var left = (screen.width/2)-(size.width/2);
                var top = (screen.height/2)-(size.height/2);

                popupWindow = window.open( '/#/widgets/' + $scope.widget._id + '/login/index', 'Enter Details', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+ size.width +', height='+ size.height +', top='+top+', left='+left);
                return;
            }

            _resetWidgetStatus();
            $scope.widgetStatus.state = play;
            console.log('before check advanced');
            var advancedParams =  _hasAdvanced() ? _getAdvanced() : null;
            console.log('After check advanced, options=', advancedParams, '_hasAdvanced()=', _hasAdvanced() );

            WidgetsService.playWidget($scope.widget, advancedParams, _isRemoteBootstrap())
                .then(function (result) {
                    console.log(['play result', result]);
                    $scope.executionId = result.data;
                    _pollStatus(1);
                }, function (err) {
                    console.log(['play error', err]);
                    _resetWidgetStatus('We are so hot that we ran out of instances. Please try again later.');
                });
        };

        $scope.stop = function () {
            WidgetsService.stopWidget($scope.widget, $scope.executionId, _isRemoteBootstrap()).then(function () {
                $scope.widgetStatus.state = stop;
                _resetWidgetStatus();
            });
        };

        $scope.getFormPath = function (widget) {
            if (widget.remoteBootstrap && widget.remoteBootstrap.cloudifyForm) {
                return '/views/widget/forms/' + widget.remoteBootstrap.cloudifyForm + '.html';
            }
            return '';
        };


        WidgetsService.getWidget($routeParams.widgetId).then(function (result) {
            $scope.widget = result.data;
        });


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
        }

        function _isRemoteBootstrap() {
            return $scope.widget.remoteBootstrap && $scope.widget.remoteBootstrap.active;
        }

    });
