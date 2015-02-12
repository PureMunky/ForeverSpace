TG.Objects.Animation.Sequence = function (interrupt) {
    var that = this;

    that.frames = new Array();
    that.interrupt = interrupt || false;

    var currentFrame = 0,
          currentTime = 0;

    var incFrame = function () {
        var rtnBool = true;
        currentFrame++;
        if (currentFrame >= that.frames.length) {
            currentFrame = 0;
            rtnBool = !interrupt;
        }

        return rtnBool;
    }

    that.Tick = function (delta) {
        var rtnBool = true;
        currentTime = currentTime + delta;
        if (currentTime > that.frames[currentFrame].t) {
            currentTime = currentTime - that.frames[currentFrame].t;
            rtnBool = incFrame();
        }

        return rtnBool;
    };

    that.addFrame = function (inFrame) {
        that.frames.push(inFrame);
    }

    that.CurrentFrame = function () {
        return that.frames[currentFrame];
    }
}