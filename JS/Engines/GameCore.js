'use strict';
TG.Engines.Game = (function (that) {
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

    $(function () {
        TG.Engines.GlobalVars._STEPTIMER = setInterval(TG.Engines.Game.Tick, 16);
    });

    // Returns a random position.
    function _getRndPos() {
        var areaSize = TG.Engines.Render.getPlayAreaSize();

        return new TG.Objects.Position(Math.floor(Math.random() * areaSize.width), Math.floor(Math.random() * areaSize.height));
    };

    function _getRndNum(max) {
        return Math.floor(Math.random() * max);
    };

    that.Tick = function () {
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
                BackgroundObjects[i].Tick();
            })(i);
        }

        var deleteIds = [];

        for (var i = 0; i < GameObjects.length; i++) {
            (function (i) {
                GameObjects[i]
                    .Tick();

                if (i!=0 && GameObjects[i].getDelete && GameObjects[i].getDelete()) {
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
        state.difficulty = 1;
        state.projectiles = 0;

        GameObjects = [];

        GameObjects[0] = TG.Engines.Generate.Player('Player', { x: 100, y: 100 });
    }

    function GenerateNewObjects() {
        var areaSize = TG.Engines.Render.getPlayAreaSize();

        // Generate Background Objects
        if (_getRndNum(1) == 0) {
            var starSpeed = (_getRndNum(100) / 100) * -20;
            if(starSpeed < -1) {
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
                var npc = TG.Engines.Generate.NPC(GameObjects.length, { x: areaSize.width - 5, y: state.chain.Pos.y }, state.difficulty);
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

    that.Distance = {
        Between: function (o1, o2) {
            o2 = o2 || GameObjects[0];
            var p1 = o1.getPosition();
            var p2 = o2.getPosition();

            return that.Distance.BetweenPos(p1, p2);
        },
        BetweenPos: function (p1, p2) {
            var a, b;
            a = Math.abs(p1.x - p2.x);
            b = Math.abs(p1.y - p2.y);

            return Math.sqrt((a * a) + (b * b));
        },
        BetweenforCompare: function (o1, o2) {
            o2 = o2 || GameObjects[0];
            var p1 = o1.getPosition();
            var p2 = o2.getPosition();

            var a, b;
            a = Math.abs(p1.x - p2.x);
            b = Math.abs(p1.y - p2.y);

            return (a * a) + (b * b);
        },
        Closest: function (o1, propertyFilter, action, propertyEquals) {
            var rtnObject = { title: 'none' };
            var shortestDistance = 1000000;

            for (var i = 0; i < GameObjects.length; i++) {
                var thisDistance = that.Distance.BetweenforCompare(o1, GameObjects[i]);
                if (o1 != GameObjects[i] && GameObjects[i].getProperties(propertyFilter, propertyEquals) && thisDistance < shortestDistance) {
                    if (action) action(GameObjects[i]);
                    shortestDistance = thisDistance;
                    rtnObject = GameObjects[i];
                }
            }

            return rtnObject;
        },
        Within: function (o1, distance, action) {
            var rtnArray = new Array();

            for (var i = 0; i < GameObjects.length; i++) {
                var thisDistance = that.Distance.Between(o1, GameObjects[i]);
                if (thisDistance < distance && o1 != GameObjects[i]) {
                    if (action) action(GameObjects[i]);
                    rtnArray.push(GameObjects[i]);
                }
            }

            return rtnArray;
        }
    };

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
            GameObjects[0].setMoving({ vertical: -3 });
        }, function () {
            GameObjects[0].setMoving({ vertical: 0 });
        });

        // Down - D
        i.AddKey('Down', '68', function () {
            GameObjects[0].setMoving({ vertical: 3 });
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

                var pos = TG.Engines.Game.Player().getPosition();

                pos = new TG.Objects.Position(pos.x, pos.y);

                GameObjects.push(new TG.Objects.Projectile('Arrow', pos, { horizontal: 1, vertical: 0 }, 20, 1000, 50, that.Player()));
            }
        }, function () {

        });

        // Interact - R
        i.AddKey('Interact', '84', function () {
            TG.Engines.Game.Player().Interact.Perform();
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
        ]);
    }(TG.Engines.Render, TG.Objects.Render));

    return that;
})(TG.Engines.Game || {});
