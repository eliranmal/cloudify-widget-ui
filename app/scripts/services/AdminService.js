'use strict';

angular.module('cloudifyWidgetUiApp')
    .factory('AdminService', function (/*$resource*/ $http, $log ) {

        $log.info('initializing AdminService');
        function AdminService(){

            this.users = function(){
                return $http.get('/backend/admin/users');
            }

        }

        return new AdminService();

        return {
            users: function () {
//                return $resource('/backend/admin/users');
                return $http.get('/backend/admin/users');

//                    , { accountUuid: "7859674589673489567" }
            }
        }
    });