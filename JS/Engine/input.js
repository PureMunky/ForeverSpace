TG.Engine.Input = (function (core) {
  'use strict';

  var that = {},
    keys = {},
    keyArray = [],
    joystick = false,
    mouse = false,
    keyboard = false,
    pressed = [];

  // Initialize the input properties.
  that.Init = function (options) {
    keyboard = options.keyboard || false;
    mouse = options.mouse || false;
    joystick = options.joystick || false;

    // Register key events when the engine is loaded.
    core.AddReady(function () {
      $(document).keydown(function (event) {
        if (keyboard && !keyboardEntry) {
          event.preventDefault();

          //TG.Engines.Game.Player().setAI();

          pressed[event.keyCode] = true;
        }

        TG.Engine.Debug.Log(event.keyCode);
      });

      $(document).keyup(function (event) {
        if (keyboard && keys[event.keyCode] && keys[event.keyCode].upAction) {
          delete pressed[event.keyCode];

          keys[event.keyCode].upAction();
        }
      });
    });

    // Register mouse events when the engine is loaded. 
    core.AddReady(function () {
      if (mouse) {
        //TODO: Set click event to be context sensitive (e.x. click on an enemy turns player hostile and attacks enemy).
        document.getElementById('playArea').addEventListener('click', function (e) {
          var clickPos = { x: e.offsetX, y: e.offsetY };
          TG.Engines.Game.Player().setAI(TG.Game.AI.toward(clickPos));
        }, false);
      }
    });
  };

  // Adds a new key to listen for presses on.
  that.AddKey = function (keyName, keyCode, DownAction, UpAction) {
    keys[keyCode] = keyboardButton(keyCode, DownAction, UpAction);
    keyArray.push(keyCode);
  };

  // Evaluates the currently pressed keys and performs their actions.
  that.Tick = function () {
    var i = 0;
    for (i = 0; i < keyArray.length; i++) {
      if (pressed[keyArray[i]] && keys[keyArray[i]] && keys[keyArray[i]].downAction) {
        keys[keyArray[i]].downAction();
      }
    }
  };

  // Determines if keyboard entry is currently allowed.
  var keyboardEntry = false;

  // Represents a key on the keyboard and it's actions.
  function keyboardButton(inKeyCode, inDownAction, inUpAction) {
    return {
      keyCode: inKeyCode,
      currentlyPressed: false,
      downAction: function () {
        inDownAction();
      },
      upAction: function () {
        inUpAction();
      }
    };
  }

  // Not-Used/Working: display a login for the user.
  function LogIn(username, password) {
    hideLogin();
    keyboardEntry = false;
  }

  // Evaluates gamepad update and performs their acions.
  function gamepadTick() {
    if (joystick) {
      var pad = navigator.getGamepads()[0];
      try {
        if (pad) {
          // Set Horizontal Motion
          if (Math.abs(pad.axes[0]) > TG.Engines.GlobalVars._GamePadThreshold) {
            TG.Engines.Game.Player().setMoving({ horizontal: pad.axes[0] });
          } else {
            TG.Engines.Game.Player().setMoving({ horizontal: 0 });
          }

          // Set Vertical Motion
          if (Math.abs(pad.axes[1]) > TG.Engines.GlobalVars._GamePadThreshold) {
            TG.Engines.Game.Player().setMoving({ vertical: pad.axes[1] });
          } else {
            TG.Engines.Game.Player().setMoving({ vertical: 0 });
          }

          // Run
          TG.Engines.Game.Player().setRun(pad.buttons[2]);

          // Attack
          // TODO: Only fire attack once per button push.
          TG.Engines.Game.Player().Attack();
        } else {

        }
      } catch (e) {

      }

      gamepadPoll();
    }
  }

  // Polls for gamepad changes.
  function gamepadPoll() {
    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(gamepadTick);
    } else if (window.mozRequestAnimationFrame) {
      window.mozRequestAnimationFrame(gamepadTick);
    } else if (window.webkitRequestAnimationFrame) {
      window.webkitRequestAnimationFrame(gamepadTick);
    }
  }

  // Start the gamepad Polling
  gamepadTick();

  return that;
})(TG.Engine.Core);