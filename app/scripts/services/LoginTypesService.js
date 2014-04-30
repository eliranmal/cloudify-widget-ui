'use strict';

angular.module('cloudifyWidgetUiApp')
  .service('LoginTypesService', function LoginTypesService( $http )  {
    var loginTypes = [];
    $http.get('/backend/widgets/login/types').then( function ( result ){
        console.log(result);
        loginTypes = result.data;
        console.log(loginTypes);
    });

        this.getAll = function(){
            return loginTypes;
        };

        this.getIndexSize = function(){
            return { 'width' : 600, 'height' : 300 }
        };

        this.getById = function( id ){
            var i = 0;
            var length = loginTypes.length;
            for ( ; i < length; i ++ ){
                if ( loginTypes[i].id === id ){
                    return loginTypes[i];
                }
            }
        }
  });
