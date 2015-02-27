TG.Engine.Dice = (function () {
  'use strict';

  var that = {},
    dice = {
      'd4': [1, 2, 3, 4],
      'd6': [1, 2, 3, 4, 5, 6],
      'd8': [1, 2, 3, 4, 5, 6, 7, 8],
      'd10': [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
      'd12': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      'd20': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      'd100': [0, 10, 20, 30, 40, 50, 60, 70, 80, 90],
      'coin': ['heads', 'tails']
    };

  // Returns a random number between 0 and max.
  function _getRndNum(max) {
    return Math.floor(Math.random() * max);
  }

  // Returns a random result from the passed die.
  function rollDice(d) {
    var rtn = '';

    if (d) {
      rtn = d[_getRndNum(d.length - 1)];
    }

    return rtn;
  }

  // Adds a die to the collection.
  that.AddDie = function (diceName, sides) {
    dice[diceName] = sides;
  }

  // rolls a die by the given name or between 0 and number.
  that.Roll = function (diceName) {
    var rtn = '';

    if (typeof diceName === 'string') {
      rtn = rollDice(dice[diceName]);
    } else if (typeof diceName === 'number') {
      rtn = _getRndNum(diceName);
    }

    return rtn;
  };

  // rolls an array of dice and returns the cumulative results.
  that.RollPool = function (dice) {
    
  };

  return that;
}());