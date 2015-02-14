TG.Game.Generate = (function (generate, o) {

    generate.Player = function (inName, inPosition, inSpeed) {
        return new o.NPC(inName, inPosition, inSpeed);
    };

    return generate;
}(TG.Game.Generate || {}, TG.Game.Objects));