// Something that is on the screen currently moving.
TG.Game.Objects.Projectile = function (inTitle, inPosition, inMoving, inSpeed, inRange, inImpactRange, inSource) {
    var that = this,
        _render = TG.Game.Animations.Bullet(),
        _startPos = new TG.Objects.Render.Position(inPosition.x, inPosition.y),
        _position = inPosition,
        _moving = inMoving,
        _speed = inSpeed,
        _range = inRange,
        _delete = false;

    _render.setAnimation('static');

    that.getRender = function () {
        var rtnRender = _render.CurrentFrame();
        rtnRender.x = _position.x;
        rtnRender.y = _position.y;
        rtnRender.DisplayTitle = true;

        return rtnRender;
    };

    that.getProperties = function () {
        return false;
    };

    that.getPosition = function () {
        return _position;
    };

    that.getDelete = function () {
        return _delete;
    };

    that.Tick = function (delta) {
        _render.setAnimation('static');

        // Delete if not moving.
        if (!_delete && _moving.horizontal == 0 && _moving.vertical == 0) {
            _delete = true;
        }

        // Delete if past the range.
        if (!_delete && TG.Engine.Measure.Distance.BetweenPos(_startPos, _position) >= _range) {
            _delete = true;
        }

        if (!_delete) {
            var hit = false;
            TG.Engine.Measure.Distance.Within(that, inImpactRange, function (target) {
                if (!hit && target.Combat && target.Combat.ReduceHP && target !== inSource) {
                    _delete = true;
                    hit = true;
                    target.Combat.ReduceHP(100, inTitle);
                }
            });
            _render.Tick(delta);

            // Update the position of the render.
            _position.x = _position.x + (_moving.horizontal * _speed * delta);
            _position.y = _position.y + (_moving.vertical * _speed * delta);
        }
        return that;
    };

    return that;
};