'use strict';

describe('Service: CustomLogin', function () {

  // load the service's module
  beforeEach(module('cloudifyWidgetUiApp'));

  // instantiate service
  var CustomLogin;
  beforeEach(inject(function (_CustomLogin_) {
    CustomLogin = _CustomLogin_;
  }));

  it('should do something', function () {
    expect(!!CustomLogin).toBe(true);
  });

});
