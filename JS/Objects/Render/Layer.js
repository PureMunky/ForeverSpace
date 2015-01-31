TG.Objects.Render.Layer = function (getObjectsFunc, deleteOffScreen) {
    'use strict';

    var that = this;

    that.getObjects = getObjectsFunc;
    that.deleteOffScreen = deleteOffScreen;
};