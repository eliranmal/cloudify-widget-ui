'use strict';

angular.module('cloudifyWidgetUiApp')
  .service('LoginTypesService', function LoginTypesService() {
    var loginTypes =  [
        {
            'id' : 'google',
            'label' : 'Google',
            'size' : {
                'width' : 100,
                'height' : 100
            }
        },
        {
            'id' : 'custom',
            'label' : 'Custom',
            'size' : {
                'width' : 100,
                'height' : 100
            }
        },
        {
            'id' : 'facebook',
            'label' : 'Facebook',
            'size' : {
                'width' : 100,
                'height' : 100
            }
        },{
            'id' : 'twitter',
            'label' : 'Twitter',
            'size' : {
                'width' : 100,
                'height' : 100
            }
        },
        {
            'id' : 'linkedin',
            'label' : 'LinkedIn',
            'size' : {
                'width' : 100,
                'height' : 100
            }
        }
    ];

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
