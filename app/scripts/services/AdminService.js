'use strict';

angular.module('cloudifyWidgetUiApp')
    .factory('AdminService', function (/*$resource*/ $http) {

        return {
            users: function () {
//                return $resource('/backend/admin/users');
                return $http.get('/backend/admin/users');

//                    , { accountUuid: "7859674589673489567" }
            }
        }
    });