'use strict';

angular.module('cloudifyWidgetUiApp')
  .directive('admin', function ( $rootScope ) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {

          function update(){
              if ( !!$rootScope.user  ){
                 if ( !$rootScope.user.isAdmin ){
                      element.remove();
                 }
              }
          }

          $rootScope.$watch('user', function(){
               update();
          });

      }
    };
  });
