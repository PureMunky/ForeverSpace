describe('Engine.Core', function () {
  var core;

  beforeEach(function () {
    core = TG.Engine.Core;
  });

  it('has Init', function () {
    expect(core.Init).toBeDefined();
  });

  it('has AddTick', function () {
    expect(core.AddTick).toBeDefined();
  });

});