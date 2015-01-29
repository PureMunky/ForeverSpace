TG.Objects.NPC = function (inTitle, inPosition, inSpeed) {
    var that = this;

    // Gets and tests a property for data.
    that.getProperties = function (getName, getEquals) {
        getEquals = getEquals || true;

        if (getName) {
            return (properties[getName] == getEquals);
        } else {
            return properties;
        }
    };

    // Data about the npc's movement.
    var moving = {
        vertical: 0,
        horizontal: 0,
        speed: inSpeed,
        left: false,
        right: false,
        up: false,
        down: false
    };

    that.getDelete = function () {
        return (_position.x < -100 || state.Combat.HP <= 0);
    };

    that.getScore = function () {
        var rtnScore = 0;

        if (state.Combat.HP <= 0) {
            rtnScore = 150 * moving.speed;
        }

        return rtnScore;
    };

    that.getMoving = function () {
        return moving;
    };

    // Set movement.
    that.setMoving = function (move) {
        if (move.vertical === 0)
            moving.vertical = 0;

        if (move.horizontal === 0)
            moving.horizontal = 0;

        moving.vertical = !!move.vertical ? move.vertical : moving.vertical;
        moving.horizontal = !!move.horizontal ? move.horizontal : moving.horizontal;

        if (moving.vertical != 0 || moving.horizontal != 0) {
            _render.setAnimation('walk');
        } else {
            // TODO: Prevent idle animation from firing when dead. Maybe set up a "what is the character doing" function.
            _render.setAnimation('idle');
        }
    };

    // state for the NPC
    // This should probably be broken up into different state types.
    var state = {
        AI: {},
        Core: {},
        Environment: {},
        TickCount: 0,
        Combat: {
            HP: 1000.0,
            MaxHP: 1000.0,
            Energy: 100.0,
            MaxEnergy: 100.0
        },
        Needs: {
            Food: 150,
            Water: 150,
            Sleep: 150,
            Sex: 1000
        },
        Memory: new Array(),
        consious: 'awake'
    };

    that.getState = function () {
        return state;
    }

    that.title = inTitle;

    // display for the NPC
    that.toString = function () {
        return that.title + ' HP: ' + Math.round(state.Combat.HP) + '/' + Math.round(state.Combat.MaxHP) + ' En: ' + Math.round(state.Combat.Energy) + that.debugInfo;
    }

    // current position
    var _position = new TG.Objects.Position(inPosition ? inPosition.x : 0, inPosition ? inPosition.y : 0);

    // gets the current position
    that.getPosition = function () {
        return _position;
    }

    // TODO: improve how to determine what render an npc gets
    // Specify what render sheet to use for the npc.
    var _render = (inTitle == 'Player') ? TG.Engines.Animation.Demo() : TG.Engines.Animation.NPCMale();

    // returns the current render information.
    that.getRender = function () {
        var rtnRender = _render.CurrentFrame();
        rtnRender.x = _position.x;
        rtnRender.y = _position.y;
        rtnRender.DisplayTitle = true;

        return rtnRender;
    }

    // sets the direction the NPC is facing
    that.setFacing = function (direction) {
        if (direction.horizontal > 0 && direction.horizontal > Math.abs(direction.vertical)) {
            // DOWN
            _render.imageY = 64;
        } else if (direction.horizontal < 0 && Math.abs(direction.horizontal) > Math.abs(direction.vertical)) {
            // LEFT
            _render.imageY = 32;
        } else if (direction.vertical > 0) {
            // Down
            _render.imageY = 0;
        } else if (direction.vertical < 0) {
            // UP
            _render.imageY = 96;
        }
    };

    // sets the current frame of animation.
    that.setAnimationFrame = function (inFrameNumber) {
        _render.imageY = inFrameNumber * _render.height;
    }

    // increments the animation frame to the next frame.
    that.incAnimationFrame = function (inTotalFrames) {
        _render.imageY += _render.height;
        if (_render.imageY >= (_render.height * 4)) _render.imageY = 0;
    }

    // what to execute on a single tick of the clock
    that.Tick = function () {

        state.TickCount = (state.TickCount >= 50) ? 0 : state.TickCount + 1;

        if (_AI) {
            _AI(that, state);
        }

        // correct the facing if the movement has changed.
        that.setFacing(moving);

        //that.incAnimationFrame(4);
        _render.Tick();

        // Update the position of the render.
        _position.x = _position.x + (moving.horizontal * TG.Engines.GlobalVars._STEPPIXELS * (moving.speed || 1));
        _position.y = _position.y + (moving.vertical * TG.Engines.GlobalVars._STEPPIXELS * (moving.speed || 1));

        return that;
    };

    // resets the position back to it was a previous time.
    that.SetPositionAt = function (historyLocation) {
        _position.x = _posHistory[historyLocation].x;
        _position.y = _posHistory[historyLocation].y;
    }

    // debug info for this NPC
    that.debugInfo = '';
    that.setDebugInfo = function (txt) {
        that.debugInfo = txt;
        return that;
    }

    // current AI for the NPC
    var _AI = function (that) {

    };

    // Sets a new AI
    that.setAI = function (newAI) {
        _AI = newAI;
    };

    // Stats for the npc
    var stats = {
        strength: 10,
        speed: 10,
        perception: 10,
        magic: 10
    }

    // Determines ability to perform actions
    that.Can = {
        See: function (o) {
            return (stats.perception * 10) > TG.Engines.Game.Distance.Between(that, o);
        },
        Attack: function (o) {
            return (that.Combat.Range() > TG.Engines.Game.Distance.Between(that, o));
        },
        Interact: function (o) {
            return (30 > TG.Engines.Game.Distance.Between(that, o));
        }
    }

    //that.Combat = TG.Engines.Combat.Assign(that);

    // Combat functions
    that.Combat = {
        Attack: function () {
            if (state.Core.attackCooldown <= 0) {
                var w = that.Inventory.PrimaryWeapon();
                state.Core.attackCooldown = w.speed;
                _render.setAnimation('attackMelee');
                var hitObjects = TG.Engines.Game.Distance.Within(that, that.Combat.Range(), function (acted) {
                    acted.Combat.HitFor(that);
                    that.Inventory.PrimaryWeapon().XPUp();
                });
                TG.Engines.Debug.Log(that.title + ' attack with ' + w.title + ' - ' + that.Combat.Damage() + 'dmg');
            }
        },
        Damage: function () {
            var w = that.Inventory.PrimaryWeapon();
            return (stats.strength * w.getDamage());
        },
        Range: function () {
            var w = that.Inventory.PrimaryWeapon();
            return (w.range);
        },
        HitFor: function (attacker) {
            var dmg = (attacker.Combat.Damage() - that.Defence.DamageReduction());

            that.Combat.ReduceHP(dmg);

        },
        ReduceHP: function (amount, source) {
            if (state.Combat.HP == 0) {
                // legitimately blank to prevent HP reduction logic from firing if there is no HP for it to effect
            } else if (amount >= state.Combat.HP) {
                that.Interact.Say(source);
                state.Combat.HP = 0;
                that.setAI(TG.Engines.AI.still());
                _render.setAnimation('dead');
            } else {
                var enPerc = (state.Combat.Energy / state.Combat.MaxEnergy);
                state.Combat.Energy -= (amount * enPerc);
                state.Combat.HP -= (amount * (1 - enPerc));
            }
        }
    };

    // Interaction actions
    that.Interact = {
        Perform: function () {
            var hitObjects = TG.Engines.Game.Distance.Within(that, 30, function (acted) {
                acted.Interact.Receive(that, that.Interact.Say(TG.Content.Comm.greetingpositive));
            });
        },
        Receive: function (performer, conversation) {
            // TODO: Open Dialog
            // that.Interact.Say('Hello ' + performer.title + ' (from ' + that.title + ')');
            that.Interact.Say(conversation);
            TG.Engines.Relationships.Mate(that, performer);
        },
        Say: function (saying) {
            if (typeof saying == 'string') {
                that.speak = saying;
            } else if (typeof saying == 'object') {
                that.speak = saying.say;
            }
            return saying;
        }
    }

    // Defense properties
    that.Defence = {
        DamageReduction: function () {
            return 0;
        }
    };
}
