﻿TG.Engine.Core = (function () {
  'use strict';

  var that = {},
    deltaStamp = new Date(),
    ticks = [], // Fires on envery tick of the game engine.
    readys = [], // Fires after the entire application has loaded.
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

  // Adds a function to be run when the engine is loaded.
  that.AddReady = function (newReady) {
    readys.push(newReady);
  }

  // To be called at the end of page load.
  that.Ready = function () {
    var i = 0;

    // Loop through ticks.
    for (i = 0; i < ticks.length; i++) {
      // Pass delta value to each tick.
      readys[i]();
    }
  }

  return that;
}());