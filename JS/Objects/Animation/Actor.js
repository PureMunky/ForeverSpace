// Something that has no interactions just for visual display.
TG.Objects.Actor = function (inTitle, inPosition, inMoving, inAnimation) {
    var that = {},
        _render = inAnimation('static'),
        _startPos = new TG.Objects.Position(inPosition.x, inPosition.y),
        _position = inPosition,
        _moving = inMoving,
        _delete = false;

    _render.setAnimation('static');

    that.Tick = function () {
        _render.setAnimation('static');
        _render.Tick();

        // Update the position of the render.
        _position.x = _position.x + (_moving.horizontal * TG.Engines.GlobalVars._STEPPIXELS);
        _position.y = _position.y + (_moving.vertical * TG.Engines.GlobalVars._STEPPIXELS);
   };

    that.getRender = function () {
        var rtnRender = _render.CurrentFrame();

        rtnRender.x = _position.x;
        rtnRender.y = _position.y;
        rtnRender.DisplayTitle = false;

        return rtnRender;
    };

    return that;
};
