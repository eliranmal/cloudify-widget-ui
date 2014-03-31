'use strict';

angular.module('cloudifyWidgetUiApp')
    .controller('NatiDemoCtrl', function ($scope) {

        $scope.model = {};

        // see: http://stackoverflow.com/questions/12197880/angularjs-how-to-make-angular-load-script-inside-ng-include
        $scope.$on('$viewContentLoaded', function cloudifyWidgetOnLoadHandler() {
                var apiKey = '879aae73-e3eb-43c8-9142-7c699689454d';
                var host = 'launch.cloudifysource.org' || 'launch.cloudifysource.org';  // backward compatibility
                var title = 'GigaSpaces XAP';
                var videoUrl = '//www.youtube.com/embed/P0rTANBRuWE';
                var params = ['apiKey=' + apiKey, 'title=' + title, 'origin_page_url=' + window.location.href, 'video_url=' + (videoUrl || '')];

                var iframe = document.createElement('iframe');
                var element = document.getElementById('widget-frame');
                element.appendChild(iframe);

                iframe.setAttribute('src', '//' + host + '/widget/widget?' + params.join('&'));
                iframe.setAttribute('frameborder', 'no');
            }
        );


        window.addEventListener('message', function (result) {
            var data = angular.fromJson(result.data);
            if (!$scope.model.appFrameUrl &&
                data && data.name === 'widget_status' &&
                data.status.consoleLink && data.status.consoleLink.url) {

                $scope.$apply(function () {
                    $scope.model.appFrameUrl = '//' + data.status.publicIp + ':8080';
                });
            }
        });


        $scope.$watch('model.appFrameUrl', function (n /*,o, s*/) {
            console.debug('> model.appFrameUrl updated: ', n);

            if (n) {
                console.log('app frame url: ', n);

                var appFrame = document.createElement('iframe');
                appFrame.setAttribute('src', n);
                appFrame.setAttribute('frameborder', 'no');

                var element = document.getElementById('app-frame');
                element.appendChild(appFrame);
            }
        }, true);

    });
