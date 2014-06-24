'use strict';

describe('Directive: apiFrame', function () {

  // load the directive's module
  beforeEach(module('cloudifyWidgetUiApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<api-frame></api-frame>');
    element = $compile(element)(scope);
    expect(element.find('iframe')).toBeTruthy();
  }));
});
