'use strict';

angular.module('cloudifyWidgetUiApp')
    .directive('jsonBinder', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function postLink(scope, element, attrs, ngModelController) {
                function input(text) {
                    return angular.fromJson(text || '');
                }
                function output(obj) {
                    return angular.toJson(obj || {}, true);
                }
                ngModelController.$parsers.push(input);
                ngModelController.$formatters.push(output);
            }
        };
    });
