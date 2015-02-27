'use strict';
var TG = {};

TG.Game = {};
TG.Game.Objects = {};

TG.Engine = {};

TG.Content = {};
TG.Objects = {};
TG.Objects.Render = {};

(function () {
  var i = 0,
      scripts = [];

  // Content
  scripts.push('JS/Content/comm.js');
  scripts.push('JS/Content/constants.js');

  // Objects
  scripts.push('JS/Objects/Render/Actor.js');
  scripts.push('JS/Objects/Render/Frame.js');
  scripts.push('JS/Objects/Render/Render.js');
  scripts.push('JS/Objects/Render/Sequence.js');
  scripts.push('JS/Objects/Render/Layer.js');
  scripts.push('JS/Objects/Render/Text.js');
  scripts.push('JS/Objects/Render/Position.js');

  // Test Scripts
  scripts.push('JS/Test/test.js');

  // Engines
  scripts.push('JS/Engine/Core.js');
  scripts.push('JS/Engine/Measure.js');
  scripts.push('JS/Engine/Dice.js');
  //scripts.push('JS/Engine/save.js');
  scripts.push('JS/Engine/input.js');
  //scripts.push('JS/Engine/movement.js');
  scripts.push('JS/Engine/render.js');
  scripts.push('JS/Engine/debug.js');


  // GameFiles
  scripts.push('JS/Game/AI.js');
  scripts.push('JS/Game/Animations.js');
  scripts.push('JS/Game/Objects/Projectile.js');
  scripts.push('JS/Game/Objects/NPC.js');
  scripts.push('JS/Game/Generate/Player.js');
  scripts.push('JS/Game/Generate/NPC.js');
  scripts.push('JS/Game/GameCore.js');

  // Write scripts to the page.
  for (i = 0; i < scripts.length; i++) {
    document.write('<script src="' + scripts[i] + '" type="text/javascript"></script>');
  }
}());

