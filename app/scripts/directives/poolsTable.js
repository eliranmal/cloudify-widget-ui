'use strict';

angular.module('cloudifyWidgetUiApp')
    .directive('poolsTable', function ($log) {
        return {
            restrict: 'EA',
            templateUrl: 'views/poolsTable.html',
            scope: {
                pools: '=ngModel',
                updateAccountPool: '=updateFn',
                deleteAccountPool: '=deleteFn'
            },
            controller: function ($scope, $element, $rootScope) {

                $scope.callUpdateAccountPool = function (editMode, pool) {
                    if (editMode) {
                        // save current state before user starts to edit
                        $scope.originalPoolSettings = pool.poolSettings;
                    } else if ($scope.originalPoolSettings !== pool.poolSettings) {
                        $scope.updateAccountPool && $scope.updateAccountPool(pool);
                    }
                };

                $scope.$watch('pools', function (newVal, oldVal) {

                    if (angular.isDefined(newVal)) {
                        if (newVal.length !== oldVal.length) {
                            // create an array of booleans in top of the scope hierarchy so we won't lose it
                            $rootScope.editModeStatusArray = new Array(newVal.length + 1).join('0').split('').map(function (val) {
                                return !!+val;
                            });
                        }
                        // refresh our local instance
                        $scope.editModeStatusArray = $rootScope.editModeStatusArray;
                    }


                    /*
                     if (angular.isDefined(newVal)) {
                     var array = new Array(5+1).join('0').split('').map(function (val) {return !!+val;});
                     //                        array.push(true);
                     $log.log('array: ', array)
                     var mask = createMask(array); // 1011
                     $log.log('mask: ', parseInt(''+mask, 2));

                     }
                     */

                    /*
                     var textareaDom = $element.find('textarea')[0],
                     scrollTop;
                     if (angular.isDefined(textareaDom)) {
                     scrollTop = textareaDom.scrollTop;
                     $log.info('scrollTop: ', scrollTop);
                     }
                     */
                });

                // TODO create bitmask for editMode states
                /*
                 function createMask () {
                 var nMask = 0, nFlag = 0, nLen = arguments.length > 32 ? 32 : arguments.length;
                 for (nFlag; nFlag < nLen; nMask |= arguments[nFlag] << nFlag++);
                 return nMask;
                 }
                 */

            }
        };
    });
