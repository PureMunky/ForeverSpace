TG.Engines.Measure = (function () {
  var that = {},
    getGameObjects;

  that.Init = function (inGameObjects) {
    getGameObjects = inGameObjects;
  };

  that.Distance = {
    Between: function (o1, o2) {
      o2 = o2 || getGameObjects()[0];
      var p1 = o1.getPosition();
      var p2 = o2.getPosition();

      return that.Distance.BetweenPos(p1, p2);
    },
    BetweenPos: function (p1, p2) {
      var a, b;
      a = Math.abs(p1.x - p2.x);
      b = Math.abs(p1.y - p2.y);

      return Math.sqrt((a * a) + (b * b));
    },
    BetweenforCompare: function (o1, o2) {
      o2 = o2 || GameObjects()[0];
      var p1 = o1.getPosition();
      var p2 = o2.getPosition();

      var a, b;
      a = Math.abs(p1.x - p2.x);
      b = Math.abs(p1.y - p2.y);

      return (a * a) + (b * b);
    },
    Closest: function (o1, propertyFilter, action, propertyEquals) {
      var rtnObject = { title: 'none' };
      var shortestDistance = 1000000,
        GameObjects = getGameObjects();

      for (var i = 0; i < GameObjects.length; i++) {
        var thisDistance = that.Distance.BetweenforCompare(o1, GameObjects[i]);
        if (o1 != GameObjects[i] && GameObjects[i].getProperties(propertyFilter, propertyEquals) && thisDistance < shortestDistance) {
          if (action) action(GameObjects[i]);
          shortestDistance = thisDistance;
          rtnObject = GameObjects[i];
        }
      }

      return rtnObject;
    },
    Within: function (o1, distance, action) {
      var rtnArray = new Array(),
        GameObjects = getGameObjects();

      for (var i = 0; i < GameObjects.length; i++) {
        var thisDistance = that.Distance.Between(o1, GameObjects[i]);
        if (thisDistance < distance && o1 != GameObjects[i]) {
          if (action) action(GameObjects[i]);
          rtnArray.push(GameObjects[i]);
        }
      }

      return rtnArray;
    }
  };

  return that;
}());