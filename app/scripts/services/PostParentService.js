'use strict';

angular.module('cloudifyWidgetUiApp')
  .service('PostParentService', function PostParentService( $location, $routeParams, $log ) {

        var originUrl = $routeParams.origin || $location.search().origin;
        if ( !originUrl ){
            $log.info('disabled. no origin parameter');
        }else{
            $log.info('initialized with origin ' + originUrl );
            this.post = function( message ){
                parent.postMessage( message, originUrl );
            }
        }

    // AngularJS will instantiate a singleton by calling "new" on this function
  });
