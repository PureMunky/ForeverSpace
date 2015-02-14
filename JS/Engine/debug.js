TG.Engine.Debug = (function () {
  'use strict';

  var that = {},
    _log = new Array();

  that.debugString = '';

  that.WriteOutput = function (inOutput) {
    if (inOutput) {
      that.debugString = inOutput;
    }
  };

  that.Log = function (inOutput) {
    _log.push(inOutput);
  };

  that.getLog = function () {
    return _log;
  }

  return that;
})();