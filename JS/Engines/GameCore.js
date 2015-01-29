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
        return new TG.Objects.Position(Math.floor(Math.random() * 1000), Math.floor(Math.random() * 500));
    };

    function _getRndNum(max) {
        return Math.floor(Math.random() * max);
    };

    that.Tick = function () {
        var i = 0;
        state.ticks++;

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

                if (GameObjects[i].getDelete && GameObjects[i].getDelete()) {
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

    function GenerateNewObjects() {

        // Generate Background Objects
        if (_getRndNum(10) == 0) {
            var starSpeed = (_getRndNum(100) / 100) * -2;

            BackgroundObjects.push(
                new TG.Objects.Actor(
                    'star',
                    new TG.Objects.Position(1000, _getRndPos().y),
                    { horizontal: starSpeed, vertical: 0 },
                    TG.Engines.Animation.Star
                )
            );
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
                var npc = TG.Engines.Generate.NPC(GameObjects.length, { x: 1000, y: state.chain.Pos.y }, state.difficulty);
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

    that.Score = function () {
        return state.score;
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

    var GameObjects = new Array();
    var BackgroundObjects = [];

    GameObjects[0] = TG.Engines.Generate.Player('Player', { x: 100, y: 100 });

    //TG.Test.Setup(GameObjects);

    /*-- Register Keys --*/

    // Up - E
    TG.Engines.Input.AddKey('69', function () {
        GameObjects[0].setMoving({ vertical: -1 });
    }, function () {
        GameObjects[0].setMoving({ vertical: 0 });
    });

    // Down - D
    TG.Engines.Input.AddKey('68', function () {
        GameObjects[0].setMoving({ vertical: 1 });
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
    TG.Engines.Input.AddKey('32', function () {
        if(state.projectiles <= totalProjectileCount) {
            state.projectiles++;

            var pos = TG.Engines.Game.Player().getPosition();

            pos = new TG.Objects.Position(pos.x, pos.y);

            GameObjects.push(new TG.Objects.Projectile('Arrow', pos, { horizontal: 1, vertical: 0 }, 20, 1000, 50, that.Player()));
        }
    }, function () {

    });

    // Interact - R
    TG.Engines.Input.AddKey('84', function () {
        TG.Engines.Game.Player().Interact.Perform();
    }, function () {

    });

    // PanRight - right
    TG.Engines.Input.AddKey('39', function () {
        TG.Engines.Render.MovePanLocation({ x: 20, y: 0 });
    }, function () {

    });
    // PanLeft - left
    TG.Engines.Input.AddKey('37', function () {
        TG.Engines.Render.MovePanLocation({ x: -20, y: 0 });
    }, function () {

    });
    // PanDown - down
    TG.Engines.Input.AddKey('40', function () {
        TG.Engines.Render.MovePanLocation({ x: 0, y: 20 });
    }, function () {

    });
    // PanUp - up
    TG.Engines.Input.AddKey('38', function () {
        TG.Engines.Render.MovePanLocation({ x: 0, y: -20 });
    }, function () {

    });

    // Test - G
    TG.Engines.Input.AddKey('71', function () {
        TG.Test.Perform();
    }, function () {

    });

    return that;
})(TG.Engines.Game || {});
