TG.Game.Core = (function (generate, render, vars, dice) {
  'use strict';

  var that = {},
    state = {
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
    },
  chainDistanceInTicks = function () {
    return 40 / state.difficulty;
  },
  enemiesInChain = 10,
  difficultyTick = 5000,
  running = false;

  // Returns a random position.
  function _getRndPos() {
    var areaSize = render.getPlayAreaSize();

    return new TG.Objects.Render.Position(Math.floor(Math.random() * areaSize.width), Math.floor(Math.random() * areaSize.height));
  };

  // Process a single tick of the game.
  function Tick(delta) {
    var i = 0;

    state.ticks++;

    if (running && that.Player().getState().Combat.HP <= 0) {
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

    for (i = 0; i < ForegroundObjects.length; i++) {
      (function (i) {
        ForegroundObjects[i].Tick(delta);
      })(i);
    }

    var deleteIds = [];

    if (running) {
      for (var i = 0; i < GameObjects.length; i++) {
        (function (i) {
          GameObjects[i]
              .Tick(delta);

          if (i != 0 && GameObjects[i].getDelete && GameObjects[i].getDelete()) {
            // if an object gives a score on destruction then set the score.
            if (GameObjects[i].getScore) {
              state.score += GameObjects[i].getScore();
            }

            // mark the id to be deleted
            deleteIds.push(i);
          }
        })(i);
      }
    }

    var deleteCount = 0;
    for (var d = 0; d < deleteIds.length; d++) {
      GameObjects.splice(deleteIds[d] - deleteCount, 1);
      deleteCount++;
    }

    GenerateNewObjects();
  }

  // Resets the game.
  function resetGame() {
    state.score = 0;
    state.lives = 3;
    GameObjects = [];
    PlayTitleScreen();
  }

  // Resets the level.
  function resetLevel() {
    ForegroundObjects = [];

    state.chain = {
      chaining: false,
      Pos: {},
      Tick: 0,
      Count: 0
    };
    state.ticks = 0;
    state.difficulty = 4;

    GameObjects = [];

    GameObjects[0] = generate.Player('Player', { x: 100, y: 100 }, 4);
    running = true;
  }

  // Creates new objects for the Tick.
  function GenerateNewObjects() {
    var areaSize = render.getPlayAreaSize();

    // Generate Background Objects
    if (dice.Roll('coin') == 'heads') {
      var starSpeed = (dice.Roll(500) / 100) * -150;
      if (starSpeed < -1) {
        BackgroundObjects.push(
            new TG.Objects.Render.Actor(
                'star',
                new TG.Objects.Render.Position(areaSize.width - 5, _getRndPos().y),
                { horizontal: starSpeed, vertical: 0 },
                TG.Game.Animations.Star
            )
        );
      }
    }

    if (running) {
      // Generate Enemy Objects
      if (!state.chain.chaining) {
        state.chain.chaining = (dice.Roll((500 / state.difficulty)) == 0);
      } else {
        if (!state.chain.Pos.y) {
          state.chain.Pos.y = _getRndPos().y;
        }

        if (state.chain.Tick == 0) {
          state.chain.Count++;
          var npc = generate.NPC(GameObjects.length, { x: areaSize.width - 5, y: state.chain.Pos.y }, state.difficulty * 50);
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
    } else if(ForegroundObjects.length <= 0) {
      PlayTitleScreen();
    }
  }

  // Display the title screen.
  function PlayTitleScreen() {
    ForegroundObjects = [];

    ForegroundObjects.push(
            new TG.Objects.Render.Actor(
                'title',
                new TG.Objects.Render.Position(render.getPlayAreaSize().width - 5, (render.getPlayAreaSize().height / 2) - 111.5),
                { horizontal: -100, vertical: 0 },
                TG.Game.Animations.Generic(vars._TitleScreen, 598, 223, 0, 0)
            )
        );
  }

  // Returns the player object.
  that.Player = function () {
    return GameObjects[0] || {};
  }

  // Adds an object to GameObjects.
  that.AddObject = function (o) {
    GameObjects.push(o);
  }

  // Layers of objects.
  var GameObjects = [];
  var BackgroundObjects = [];
  var ForegroundObjects = [];

  /*-- Register Keys --*/
  (function (i) {
    // enable keyboard but no other input method.
    i.Init({
      keyboard: true
    });

    i.AddKey('Enter', '13', function () {
      if (!running) {
        resetLevel();
      }
    }, function () {

    });

    // Up - E
    i.AddKey('Up', '69', function () {
      if (running) { GameObjects[0].setMoving({ vertical: -50 }); }
    }, function () {
      if (running) { GameObjects[0].setMoving({ vertical: 0 }); }
    });

    // Down - D
    i.AddKey('Down', '68', function () {
      if (running) { GameObjects[0].setMoving({ vertical: 50 }); }
    }, function () {
      if (running) { GameObjects[0].setMoving({ vertical: 0 }); }
    });

    // Attack - Space
    i.AddKey('Attack', '32', function () {
      if (running) {
        var pos = that.Player().getPosition();

        pos = new TG.Objects.Render.Position(pos.x, pos.y);

        GameObjects.push(new TG.Game.Objects.Projectile('Arrow', pos, { horizontal: 1, vertical: 0 }, 1000, 1000, 50, that.Player()));
      }
    }, function () {

    });

    // PanRight - right
    i.AddKey('PanRight', '39', function () {
      render.MovePanLocation({ x: 20, y: 0 });
    }, function () {

    });
    // PanLeft - left
    i.AddKey('PanLeft', '37', function () {
      render.MovePanLocation({ x: -20, y: 0 });
    }, function () {

    });
    // PanDown - down
    i.AddKey('PanDown', '40', function () {
      render.MovePanLocation({ x: 0, y: 20 });
    }, function () {

    });
    // PanUp - up
    i.AddKey('PanUp', '38', function () {
      render.MovePanLocation({ x: 0, y: -20 });
    }, function () {

    });

    // Test - G
    i.AddKey('Test', '71', function () {
      TG.Test.Perform();
    }, function () {

    });

  }(TG.Engine.Input));

  /*-- Initialize Render Engine --*/
  (function (er, or) {
    // Initialize the Render Engine.
    er.Init([
        new or.Layer(function () { return BackgroundObjects || []; }, true),
        new or.Layer(function () { return GameObjects || []; }, false),
        new or.Layer(function () { return ForegroundObjects || []; }, true)
    ], [
        new or.Text(function () { return 'Score: ' + state.score; }, new TG.Objects.Render.Position(50, 30), function () { return running; }),
        new or.Text(function () { return 'Lives: ' + state.lives; }, new TG.Objects.Render.Position(50, 50), function () { return running; }),
        new or.Text(function () { return 'Health: ' + (that.Player().getState ? that.Player().getState().Combat.HP : 0) }, new TG.Objects.Render.Position(50, 70), function () { return running; }),
        new or.Text(function () { return 'Debug: ' + TG.Engine.Debug.debugString; }, new TG.Objects.Render.Position(50, 90), function () { return running; }),
    ],
    that.Player);
  }(TG.Engine.Render, TG.Objects.Render));

  /*-- Initialize Measure --*/
  (function (m) {
    m.Init(function () {
      return GameObjects || [];
    });
  }(TG.Engine.Measure));

  /*-- Main Loop --*/
  (function (core) {

    // set the speed of the udpate.
    core.Init(16);

    // Add input evaluation.
    core.AddTick(TG.Engine.Input.Tick);

    // Add main game loop.
    core.AddTick(Tick);

    // start the game.
    core.AddReady(resetGame);

  }(TG.Engine.Core));

  return that;
})(TG.Game.Generate, TG.Engine.Render, TG.Engine.GlobalVars, TG.Engine.Dice);
