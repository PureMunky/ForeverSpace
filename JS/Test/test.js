// Test object used only to test things.
TG.Test = (function (generate) {
    'use strict';

    var that = {},
        GameObjects;

    // Returns a random position.
    function _getRndPos() {
        return new TG.Objects.Render.Position(Math.floor(Math.random() * 1000), Math.floor(Math.random() * 1000));
    };

    function _getRndNum(max) {
        return Math.floor(Math.random() * max);
    };

    // generate objects based on the passed count
    function _PopulateObjects(NPCCount, FoodCount, WaterCount) {
        var i = 0;

        // Generate Test NPCs
        for (i = 0; i < NPCCount; i++) {
            that.PopNPC();
        }

        // Generate Test Food
        for (i = 0; i < FoodCount; i++) {
            that.PopFood();
        }

        // Generate Test Water
        for (i = 0; i < WaterCount; i++) {
            that.PopWater();
        }
    }

    // Initiates the test object.
    that.Setup = function (inGameObjects) {
        GameObjects = inGameObjects;
        _Start();
    };

    // Sample setup for random generation.
    function _Start() {
        _PopulateObjects(10, 10, 10);

        // Create a pony for Ashley. :)
        GameObjects.push(generate.NPC('Pony', { x: 800, y: 100 }));
    };

    // Sample setup for hostile generation.
    function _StartHostile() {
        var i = 0; 
        _PopulateObjects(20, 0, 0);

        for (i = 0; i < GameObjects.length; i++) {
            GameObjects[i].setAI(TG.Game.AI.hostile(GameObjects[0]))
        }
    };

    // Generates a random NPC.
    that.PopNPC = function () {
        GameObjects.push(generate.NPC(GameObjects.length, _getRndPos()));
    };

    // Gennerates a random food.
    that.PopFood = function () {
        GameObjects.push(generate.Plants.Corn(_getRndPos()));
    };

    // Gennerates a random water. 
    that.PopWater = function () {
        GameObjects.push(generate.Water(_getRndPos()));
    };

    // Test projectile creation.
    that.PopProj = function () {
        var pos = TG.Engines.Game.Player().getPosition();
        var moving = TG.Engines.Game.Player().getMoving();

        pos = new TG.Objects.Render.Position(pos.x, pos.y);
        //moving = new TG.Objects.Moving(moving.horizontal, moving.vertical);

        GameObjects.push(new TG.Objects.Projectile('Arrow', pos, { horizontal: moving.horizontal, vertical: moving.vertical }, _getRndNum(20), _getRndNum(1000)));
    };

    // Test action that is mapped to a key press "G"
    that.Perform = function () {
        //that.PopNPC();
        that.PopProj();
    };

    return that;
}(TG.Game.Generate));