TG.Engines.Core = (function () {
  'use strict';
  var that = {},
    deltaStamp = new Date(),
    ticks = [],
    timer;

  function Tick () {
    var i = 0,
      now = new Date(),
      delta = (now - deltaStamp) / 1000;

    deltaStamp = now;

    for (i = 0; i < ticks.length; i++) {
      ticks[i](delta);
    }
  };

  that.Init = function (rate) {
    timer = setInterval(Tick, rate);
  };

  that.AddTick = function (newTick) {
    ticks.push(newTick);
  };


  return that;
}());