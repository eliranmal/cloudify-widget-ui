'use strict';

angular.module('cloudifyWidgetUiApp')
  .controller('DashboardCtrl', function ($scope, $log, WidgetsService ) {
        $log.info('getting widgets');
        function listWidgets(){
        WidgetsService.listWidgets().then(
            function success( result ){
                $log.info('got widgets successfully');
                $scope.widgets = result.data;
            },
            function error( result ){
                $log.error('unable to get widgets');
                $scope.pageError = result.data.message;

            }
        );}

        listWidgets();


        $scope.delete = function( widget ){
            WidgetsService.deleteWidget( widget).then( function(){
                listWidgets();
            });
        }


  });
