'use strict';

describe('Controller: CustomLoginCtrl', function () {

  // load the controller's module
  beforeEach(module('cloudifyWidgetUiApp'));

  var CustomLoginCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CustomLoginCtrl = $controller('CustomLoginCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
