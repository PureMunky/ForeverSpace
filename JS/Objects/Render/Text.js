TG.Objects.Render.Text = function (getTextFunc, position, getVisibleFunc) {
  'use strict';

  var that = this;

  that.getText = getTextFunc;
  that.position = position;
  that.getVisible = getVisibleFunc;
};