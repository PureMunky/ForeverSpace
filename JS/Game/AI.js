TG.Game.AI = (function () {
  'use strict';

  var that = {};

	var _still = function () {
		return function (that) {
			that.setMoving({horizontal: 0, vertical: 0});
		}

	}
	
	var _idle = function () {
		return function (that) {
			var facing = {
				vertical: 0,
				horizontal: 0
			};
			// TODO: Remove random and base this on environment.
			if(Math.random() * 100 < 1) {
				var rnd = Math.random() * 100;
				switch (true){
					case rnd < 25:
						facing.vertical = 0;
						facing.horizontal = -1;
						break;
					case rnd < 50:
						facing.vertical = 0;
						facing.horizontal = 1;
						break;
					case rnd < 75:
						facing.veritcal = -1;
						facing.horizontal = 0;
						break;
					case rnd < 100:
						facing.vertical = -1;
						facing.horizontal = 0;
						break;
				}
			}
			that.setMoving({horizontal: 0, vertical: 0});
			that.setFacing(facing);
			return facing;
		}
	}
	
	var _wander = function (distance) {
		var distance = distance || 100;
		
		return function (that, state) {	
			if(state.initialized) {
				var newMove = _idle()(that);
				
				if(Math.random() * 100 < 10) {
					//TODO: Make the wander algorithm have a distance boundary.
					that.setMoving({horizontal: 0, vertical: 0});
				} else {
					if (
						newMove.horizonal == 1 ||
						newMove.horizontal == -1 ||
						newMove.vertical == 1 ||
						newMove.vertical == -1
					) {
						that.setMoving(newMove);
					}
				}
				
			} else {
				state.initialized = true;
				state.originPoint = that.getPosition();
				
			}
		}
	}
	
	var _pace = function (distance, direction) {
		var distance = distance || 20;
		var newMoving = direction || {
			vertical: 0,
			horizontal: 1
		};
		
		return function (that, state) {			
			if(state.initialized == 'pace') {
				state.moveTick++;
				if (state.moveLoop == state.moveTick) {
					state.moveTick = 0;
					newMoving = state.moving;
					
					newMoving.vertical = state.moving.vertical * -1;
					newMoving.horizontal = state.moving.horizontal * -1;
					
					state.moving = newMoving;
					
					that.setMoving(newMoving);
				}
			} else {
				state.initialized = 'pace';
				state.moveLoop = distance;
				state.moveTick = 0;
				state.moving = newMoving;
				
				that.setMoving(newMoving);
			}
		}
	};
	
	var _toward = function (position, speed) {
		speed = speed || 1;
		
		return function (that, state) {
			var newMoving = {
				vertical: 0,
				horizontal: 0
			}
			
			var pos = that.getPosition();
			var run = (position.x - pos.x);
			var rise = (position.y - pos.y);
			var newH = run / (Math.abs(run) + Math.abs(rise));
			var newV = rise / (Math.abs(run) + Math.abs(rise));
			
			/*
			if (pos.x < position.x) newMoving.horizontal = speed * 1;
			if (pos.x > position.x) newMoving.horizontal = speed * -1;
			if (pos.y < position.y) newMoving.vertical = speed * 1;
			if (pos.y > position.y) newMoving.vertical = speed * -1;
			if (pos.x == position.x && pos.y == position.y) that.setAI(function() {});
			*/
			
			that.setMoving({vertical: newV, horizontal: newH});
		}	
	};
	
	var _hostile = function (npc) {
		//TODO: Fix the pacing algorithm to stop moving diagonally after the player has escaped the AIs perception.
		return function (that, state) {			
			if(!that.Can.See(npc)) {
				_pace()(that, state);
			} else if (that.Can.Attack(npc)) {
				that.Combat.Attack();
			} else {
				_toward(npc.getPosition())(that, state);
			}
		}
	};
	
	var _seek = function (propertyFilter, propertyEquals) {
		// TODO: Seek multiple property types, add priority.
		// TODO: Ask "friends" if they're willing to give an item.
		return function (that, state) {
			var inv = that.getInventory();
			var found = false;
			for(var i = 0; i < inv.length; i++) {
				if (inv[i].getProperties(propertyFilter) && !found) {
					found = true;
					that.Inventory.Use(inv[i]);
				}
			}
			
			var o = TG.Engines.Game.Distance.Closest(that, propertyFilter, function () { }, propertyEquals);
			if (!found && o.title != 'none') {
				if(!that.Can.See(o)) {
					_toward(o.getPosition(), .4)(that, state);
				} else if (that.Can.Interact(o)) {
					that.Interact.Perform();
				} else {
					_toward(o.getPosition())(that, state);
				}
			} else {
				// TODO: If the npc can't find an item and still seeks it then they can offer a quest for others to find it for them.
				_idle()(that, state);
			}
			
		}
	}
	
	var _sleep = function () {
		return function (that, state) {
			that.Interact.Say('Zzzz...');
			state.consious = 'sleeping'; // TODO: Fall asleep : set state.consious = 'Sleeping';
			_idle()(that, state);
		}
	}
	
	var _normal = function () {
		return function (that, state) {
			_idle()(that, state);
			
			if (that.Hungry()) {
				TG.Engine.Debug.Log(that.title + ' seeks food.');
				state.consious = 'awake';
				that.Interact.Say('I\'m hungry...');
				_seek('food')(that, state);
			} else if (that.Thirsty()) {
				TG.Engine.Debug.Log(that.title + ' seeks water.');
				state.consious = 'awake';
				that.Interact.Say('I\'m thirsty...');
				_seek('water')(that, state);
			} else if (that.Is.Horny()){
				TG.Engine.Debug.Log(that.title + ' seeks sex.');
				state.consious = 'awake';
				that.Interact.Say('Brown chicken brown cow..');
				_seek('sexA', that.getProperties('sexB'))(that, state);
			} else if (that.Sleepy()) {
				TG.Engine.Debug.Log(that.title + ' seeks sleep.');
				_sleep()(that, state);
			} else {
				if(state.consious == 'sleeping' && state.Needs.Sleep > 900) {
					state.consious = 'awake';
					that.Interact.Say('');
				}
			}
		}	
	};

	that.weave = function (distance) {
	    return function (that, state) {
	        if (!state.startPos) {
	            state.startPos = {
	                x: that.getPosition().x,
                    y: that.getPosition().y
	            }
	        }

	        var moving = {
	            horizontal: -1,
                vertical: 0
	        };

            if (Math.abs(state.startPos.y - that.getPosition().y) >= distance) {
                state.up = !state.up;
            }

            moving.vertical = (state.up ? -1 : 1);

            that.setMoving(moving);
	    };
	}

	that.still = function () { return _still(); };
	that.idle = function () { return _idle(); };
	that.wander = function (distance) { return _wander(distance); };
	that.pace = function (distance, direction) { return _pace(distance, direction); };
	that.toward = function (position) { return _toward(position); };
	that.hostile = function (npc) { return _hostile(npc); };
	that.normal = function () { return _normal(); };
	

	return that;
}());
