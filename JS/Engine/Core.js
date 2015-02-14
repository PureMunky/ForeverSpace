TG.Engine.Core = (function () {
  'use strict';

  var that = {},
    deltaStamp = new Date(),
    ticks = [],
    timer;

  // Iterates through the ticks at the rate initiated.
  function Tick () {
    var i = 0,
      now = new Date(),
      delta = (now - deltaStamp) / 1000;

    // Set last time the loop ran.
    deltaStamp = now;

    // Loop through ticks.
    for (i = 0; i < ticks.length; i++) {
      // Pass delta value to each tick.
      ticks[i](delta);
    }
  };

  // Initiate Core Loop
  that.Init = function (rate) {
    timer = setInterval(Tick, rate);
  };

  // Adds something to be called on each tick.
  that.AddTick = function (newTick) {
    ticks.push(newTick);
  };


  return that;
}());