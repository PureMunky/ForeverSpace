TG.Engine.Render = (function (g) {
  'use strict';
  var that = {},
    PanLocation = {
    x: 0,
    y: 0
  },
  layers = [],
  texts = [],
  FollowObject,
  areaSize = {
    height: 100,
    width: 100
  };

  that.getPlayAreaSize = function () {
    return areaSize;
  };

  that.Init = function (inLayers, inTexts, inFollowObject) {
    layers = inLayers;
    texts = inTexts;
    FollowObject = inFollowObject;
  };

  that.Context = {};

  that.MovePanLocation = function (inPosition) {
    PanLocation.x = PanLocation.x + inPosition.x;
    PanLocation.y = PanLocation.y + inPosition.y;
  };

  that.FillScreen = function () {
    $('#playArea').width(1);
    $('#playArea').height(1);
    that.SetPlayAreaSize($(document).width(), $(document).height());
  };

  that.SetPlayAreaSize = function (width, height) {
    areaSize.height = height;
    areaSize.width = width;

    $('#playArea').width(width);
    $('#playArea').height(height);
    if (document.getElementById('playArea')) {
      document.getElementById('playArea').setAttribute('width', width + 'px');
      document.getElementById('playArea').setAttribute('height', height + 'px');
    }
  };

  function WriteOutput(inOutput, inPosition) {
    var x = inPosition ? inPosition.x : 50,
        y = inPosition ? inPosition.y : 30;

    that.Context.font = "15px 'courier new'";
    that.Context.fillStyle = "White";
    that.Context.fillText(inOutput, x, y);
  };

  that.Pan = function (vPixels, hPixels) {
    // TODO: Setup panning
    var p = true;
  };

  function clearCanvas() {
    document.getElementById('playArea').width = document.getElementById('playArea').width;
  }

  function drawArray(renderArray, deleteOffScreen) {
    var viewAbleItemsCount = 0;

    for (var i = 0; i < renderArray.length; i++) {
      try {
        var r = renderArray[i].getRender();

        if ((r.x + r.width) - PanLocation.x > 0
                && r.x - PanLocation.x < $('#playArea').width()
                && (r.y + r.height) - PanLocation.y > 0
                && r.y - PanLocation.y < $('#playArea').height()
            ) {
          // Object is on screen
          viewAbleItemsCount++;
          that.Context.drawImage(r.image,
              r.imageX,
              r.imageY,
              r.width,
              r.height,
              r.x - PanLocation.x,
              r.y - PanLocation.y,
              r.width,
              r.height
          );

          // Write title/name
          if (renderArray[i].title && r.DisplayTitle) {
            WriteOutput(renderArray[i].toString(),
                r.x + r.width - PanLocation.x,
                r.y + r.height - PanLocation.y
            );
          }

          // Write current spoken words.
          if (renderArray[i].speak) {
            WriteOutput(renderArray[i].speak,
                r.x - PanLocation.x,
                r.y - PanLocation.y
            );
          }
        } else {
          // Object is off screen.
          if (deleteOffScreen) {
            renderArray.splice(i, 1);
            i--;
          }
        }
      } catch (e) {
        WriteOutput(e, new TG.Objects.Render.Position(50, 70));
      }
    }
  }

  that.drawCanvas = function () {
    requestAnimationFrame(that.drawCanvas);
    clearCanvas();

    if (FollowObject().getPosition) {
      var p = FollowObject().getPosition();

      if (p.x < PanLocation.x + g._BorderPadding) {
        PanLocation.x--;
      } else if (p.x > PanLocation.x + $('#playArea').width() - g._BorderPadding) {
        PanLocation.x++;
      }

      if (p.y < PanLocation.y + g._BorderPadding) {
        PanLocation.y--;
      } else if (p.y > PanLocation.y + $('#playArea').height() - g._BorderPadding) {
        PanLocation.y++;
      }
    }
    var i = 0;

    // Draw the animation layers.
    for (i = 0; i < layers.length; i++) {
      drawArray(layers[i].getObjects(), layers[i].deleteOffScreen);
    }

    // Draw the text outputs.
    for (i = 0; i < texts.length; i++) {
      WriteOutput(texts[i].getText(), texts[i].position);
    }

  };

  return that;
})(TG.Engine.GlobalVars);

window.requestAnimationFrame = (function () {
  return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (/* function */callback, /* DOMElement */element) {
        window.setTimeout(callback, 1000 / 60);
      };
})();

TG.Engine.Core.AddReady(function () {
  TG.Engine.Render.FillScreen();
  $(window).resize(function () {
    TG.Engine.Render.FillScreen();
  });

  if (document.getElementById('playArea')) {
    TG.Engine.Render.Context = document.getElementById('playArea').getContext('2d');
    TG.Engine.Render.drawCanvas();
  }
});