'use strict';

describe('Service: LoginTypesService', function () {

  // load the service's module
  beforeEach(module('cloudifyWidgetUiApp'));

  // instantiate service
  var LoginTypesService;
  beforeEach(inject(function (_LoginTypesService_) {
    LoginTypesService = _LoginTypesService_;
  }));

  it('should do something', function () {
    expect(!!LoginTypesService).toBe(true);
  });

});
