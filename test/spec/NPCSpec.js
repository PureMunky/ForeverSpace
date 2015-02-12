describe('NPC', function () {
  var NPC;
  beforeEach(function () {
    NPC = new TG.Engines.Generate.NPC('Test', { x: 0, y: 0 }, 1);
  });

  it('works', function () {
    expect(1).toBe(1);
  });

  it('has a name', function () {
    expect(NPC.title).toBe('Test');
  });

  it('has a position', function () {
    expect(NPC.getPosition().x).toBe(0);
    expect(NPC.getPosition().y).toBe(0);
  });

  describe('getProperties', function () {
    it('has a getProperties function', function () {
      expect(NPC.getProperties).toBeDefined();
    });
  });

  describe('state', function () {
    it('has a getState function', function () {
      expect(NPC.getState).toBeDefined();
    });
  });
});