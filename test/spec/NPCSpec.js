describe('NPC', function () {
  var NPC;

  beforeEach(function () {
    NPC = new TG.Game.Generate.NPC('Test', { x: 0, y: 0 }, 1);
  });

  describe('General', function () {
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

    it('gets a state object', function () {
      expect(NPC.getState()).toBeDefined();
    });

    it('has AI', function () {
      expect(NPC.getState().AI).toBeDefined();
    });

    it('has Core', function () {
      expect(NPC.getState().Core).toBeDefined();
    });

    it('has Environment', function () {
      expect(NPC.getState().Environment).toBeDefined();
    });

    it('has TickCount', function () {
      expect(NPC.getState().TickCount).toBeDefined();
      expect(NPC.getState().TickCount).toBe(0);
    });

    describe('Combat', function () {
      it('has Combat', function () {
        expect(NPC.getState().Combat).toBeDefined();
      });
    });
  });

});