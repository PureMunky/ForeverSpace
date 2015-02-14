'use strict';
TG.Game = (function (that) {
  var state = {
    score: 0,
    lives: 3,
    chain: {
      chaining: false,
      Pos: {},
      Tick: 0,
      Count: 0
    },
    ticks: 0,
    difficulty: 1,
    projectiles: 0
  },
  chainDistanceInTicks = function () {
    return 40 / state.difficulty;
  },
  enemiesInChain = 10,
  difficultyTick = 5000,
  totalProjectileCount = 2;

  // Returns a random position.
  function _getRndPos() {
    var areaSize = TG.Engines.Render.getPlayAreaSize();

    return new TG.Objects.Position(Math.floor(Math.random() * areaSize.width), Math.floor(Math.random() * areaSize.height));
  };

  function _getRndNum(max) {
    return Math.floor(Math.random() * max);
  };

  function Tick(delta) {
    var i = 0;

    state.ticks++;

    if (that.Player().getState().Combat.HP <= 0) {
      state.lives--;

      if (state.lives <= 0) {
        // Game Over
        resetGame();
      } else {
        // Death
        resetLevel();
      }
    }

    if (state.ticks >= difficultyTick) {
      state.ticks = 0;
      state.difficulty++;
    }

    for (i = 0; i < BackgroundObjects.length; i++) {
      (function (i) {
        BackgroundObjects[i].Tick(delta);
      })(i);
    }

    var deleteIds = [];

    for (var i = 0; i < GameObjects.length; i++) {
      (function (i) {
        GameObjects[i]
            .Tick(delta);

        if (i != 0 && GameObjects[i].getDelete && GameObjects[i].getDelete()) {
          // if an object gives a score on destruction then set the score.
          if (GameObjects[i].getScore) {
            state.score += GameObjects[i].getScore();
          }

          // if the object is a projectile then reduce the number of projectiles on the screen.
          if (GameObjects[i] instanceof TG.Objects.Projectile) {
            state.projectiles--;
          }

          // mark the id to be deleted
          deleteIds.push(i);
        }
      })(i);
    }

    var deleteCount = 0;
    for (var d = 0; d < deleteIds.length; d++) {
      GameObjects.splice(deleteIds[d] - deleteCount, 1);
      deleteCount++;
    }

    GenerateNewObjects();
  };

  function resetGame() {
    state.score = 0;
    state.lives = 3;

    resetLevel();
  }

  function resetLevel() {
    state.chain = {
      chaining: false,
      Pos: {},
      Tick: 0,
      Count: 0
    };
    state.ticks = 0;
    state.difficulty = 4;
    state.projectiles = 0;

    GameObjects = [];

    GameObjects[0] = TG.Engines.Generate.Player('Player', { x: 100, y: 100 }, 4);
  }

  function GenerateNewObjects() {
    var areaSize = TG.Engines.Render.getPlayAreaSize();

    // Generate Background Objects
    if (_getRndNum(1) == 0) {
      var starSpeed = (_getRndNum(500) / 100) * -150;
      if (starSpeed < -1) {
        BackgroundObjects.push(
            new TG.Objects.Actor(
                'star',
                new TG.Objects.Position(areaSize.width - 5, _getRndPos().y),
                { horizontal: starSpeed, vertical: 0 },
                TG.Engines.Animation.Star
            )
        );
      }
    }


    // Generate Enemy Objects
    if (!state.chain.chaining) {
      state.chain.chaining = (_getRndNum((500 / state.difficulty)) == 0);
    } else {
      if (!state.chain.Pos.y) {
        state.chain.Pos.y = _getRndPos().y;
      }

      if (state.chain.Tick == 0) {
        state.chain.Count++;
        var npc = TG.Engines.Generate.NPC(GameObjects.length, { x: areaSize.width - 5, y: state.chain.Pos.y }, state.difficulty * 50);
        GameObjects.push(npc);
      }

      state.chain.Tick++;

      if (state.chain.Tick > chainDistanceInTicks()) {
        state.chain.Tick = 0;
      }
      if (state.chain.Count >= enemiesInChain) {
        state.chain.Count = 0;
        state.chain.chaining = false;
        state.chain.Pos = {};
      }
    }
  }

  that.Player = function () {
    return GameObjects[0];
  }

  that.CurrentState = function () {
    return {
      GameObjects: GameObjects || [],
      BackgroundObjects: BackgroundObjects || []
    };
  }

  that.AddObject = function (o) {
    GameObjects.push(o);
  }

  var GameObjects = [];
  var BackgroundObjects = [];

  resetGame();

  /*-- Register Keys --*/
  (function (i) {
    // enable keyboard but no other input method.
    i.Init({
      keyboard: true
    });

    // Up - E
    i.AddKey('Up', '69', function () {
      GameObjects[0].setMoving({ vertical: -50 });
    }, function () {
      GameObjects[0].setMoving({ vertical: 0 });
    });

    // Down - D
    i.AddKey('Down', '68', function () {
      GameObjects[0].setMoving({ vertical: 50 });
    }, function () {
      GameObjects[0].setMoving({ vertical: 0 });
    });

    // Right - F
    //TG.Engines.Input.AddKey('70', function () {
    //    GameObjects[0].setMoving({ horizontal: 1 });
    //}, function () {
    //    GameObjects[0].setMoving({ horizontal: 0 });
    //});

    // Left - S
    //TG.Engines.Input.AddKey('83', function () {
    //    GameObjects[0].setMoving({ horizontal: -1 });
    //}, function () {
    //    GameObjects[0].setMoving({ horizontal: 0 });
    //});

    // Attack - Space
    i.AddKey('Attack', '32', function () {
      if (state.projectiles <= totalProjectileCount) {
        state.projectiles++;

        var pos = that.Player().getPosition();

        pos = new TG.Objects.Position(pos.x, pos.y);

        GameObjects.push(new TG.Objects.Projectile('Arrow', pos, { horizontal: 1, vertical: 0 }, 1000, 1000, 50, that.Player()));
      }
    }, function () {

    });

    // Interact - R
    i.AddKey('Interact', '84', function () {
      that.Player().Interact.Perform();
    }, function () {

    });

    // PanRight - right
    i.AddKey('PanRight', '39', function () {
      TG.Engines.Render.MovePanLocation({ x: 20, y: 0 });
    }, function () {

    });
    // PanLeft - left
    i.AddKey('PanLeft', '37', function () {
      TG.Engines.Render.MovePanLocation({ x: -20, y: 0 });
    }, function () {

    });
    // PanDown - down
    i.AddKey('PanDown', '40', function () {
      TG.Engines.Render.MovePanLocation({ x: 0, y: 20 });
    }, function () {

    });
    // PanUp - up
    i.AddKey('PanUp', '38', function () {
      TG.Engines.Render.MovePanLocation({ x: 0, y: -20 });
    }, function () {

    });

    // Test - G
    i.AddKey('Test', '71', function () {
      TG.Test.Perform();
    }, function () {

    });

  }(TG.Engines.Input));

  /*-- Initialize Render Engine --*/
  (function (er, or) {
    // Initialize the Render Engine.
    er.Init([
        new or.Layer(function () { return BackgroundObjects || []; }, true),
        new or.Layer(function () { return GameObjects || []; }, false)
    ], [
        new or.Text(function () { return 'Score: ' + state.score; }, new TG.Objects.Position(50, 30)),
        new or.Text(function () { return 'Lives: ' + state.lives; }, new TG.Objects.Position(50, 50)),
        new or.Text(function () { return 'Health: ' + that.Player().getState().Combat.HP }, new TG.Objects.Position(50, 70)),
        new or.Text(function () { return 'Debug: ' + TG.Engines.Debug.debugString; }, new TG.Objects.Position(50, 90)),
    ],
    that.Player);
  }(TG.Engines.Render, TG.Objects.Render));

  /*-- Initialize Measure --*/
  (function (m) {
    m.Init(function () {
      return GameObjects || [];
    });
  }(TG.Engines.Measure));

  /*-- Main Loop --*/
  (function (core) {

    // set the speed of the udpate.
    core.Init(16);

    // Add input evaluation.
    core.AddTick(TG.Engines.Input.Tick);

    // Add main game loop.
    core.AddTick(Tick);

  }(TG.Engines.Core));

  return that;
})(TG.Engines.Game || {});
