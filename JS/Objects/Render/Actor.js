// Something that has no interactions just for visual display.
TG.Objects.Render.Actor = function (inTitle, inPosition, inMoving, inAnimation) {
    var that = {},
        _render = inAnimation('static'),
        _startPos = new TG.Objects.Render.Position(inPosition.x, inPosition.y),
        _position = inPosition,
        _moving = inMoving,
        _delete = false;

    _render.setAnimation('static');

    that.Tick = function (delta) {
        _render.setAnimation('static');
        _render.Tick(delta);

        // Update the position of the render.
        _position.x = _position.x + (_moving.horizontal * delta);
        _position.y = _position.y + (_moving.vertical * delta);
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
