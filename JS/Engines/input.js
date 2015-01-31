'use strict';
TG.Engines.Input = (function (that) {
    var keys = {},
        joystick = false,
        mouse = false,
        keyboard = false;

    that.Init = function (options) {
        keyboard = options.keyboard || false;
        mouse = options.mouse || false;
        joystick = options.joystick || false;
    };

    that.AddKey = function (keyCode, DownAction, UpAction) {
        keys[keyCode] = keyboardButton(keyCode, DownAction, UpAction);
    };

    $(function () {
        $(document).keydown(function (event) {
            if (keyboard && !keyboardEntry) {
                event.preventDefault();
				//TODO: smooth out when pressing two opposing directions at the same time (e.x. Left and Right).
				//TODO: add ability to click/touch where to move to (for phone/tablet).
				TG.Engines.Game.Player().setAI();

				if (keys[event.keyCode] && keys[event.keyCode].downAction) {
				    keys[event.keyCode].downAction();
				}
            }
            
            TG.Engines.Debug.Log(event.keyCode);
        });

        $(document).keyup(function (event) {
            if (keyboard && keys[event.keyCode] && keys[event.keyCode].upAction) {
                keys[event.keyCode].upAction();
            }
        });
    });

    var keyboardEntry = false;

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

    function LogIn(username, password) {
        hideLogin();
        keyboardEntry = false;
    }
    
    $(function () {
        if (mouse) {
            //TODO: Set click event to be context sensitive (e.x. click on an enemy turns player hostile and attacks enemy).
            document.getElementById('playArea').addEventListener('click', function (e) {
                var clickPos = { x: e.offsetX, y: e.offsetY };
                TG.Engines.Game.Player().setAI(TG.Engines.AI.toward(clickPos));
            }, false);
        }
    });
    
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
                    //TG.Engines.Debug.WriteOutput('no gamepad');
                }
            } catch (e) {

            }

            gamepadPoll();
        }
    }
    
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
    
    return that	;
})(TG.Engines.Input || {});