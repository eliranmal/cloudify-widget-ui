'use strict';

angular.module('cloudifyWidgetUiApp')
    .service('TextContentCompiler', function TextContentCompiler($compile, $timeout) {

        this.asText = function (scope, element, targetElementSelector, excludeAttributes) {
            $timeout(function () {
                // create an element to hold the ng attributes - so we can ditch it after compile
                var wrapper = angular.element('<div>');
                var html = $compile(wrapper.append(element.contents()))(scope);
                var target = html.find(targetElementSelector);
                for (var attr in excludeAttributes) {
                    var attrVal = excludeAttributes[attr];
                    target.removeAttr(attrVal);
                }
//                element.parent()[0].textContent = target[0].outerHTML;
                var textarea = angular.element('<textarea>');
                textarea[0].textContent = target[0].outerHTML;
                element.replaceWith(textarea);
            }, 100);
        };
    });
