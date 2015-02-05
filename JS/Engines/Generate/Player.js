TG.Engines.Generate = (function (generate, o) {

    generate.Player = function (inName, inPosition, inSpeed) {
        return new o.NPC(inName, inPosition, inSpeed);
    };

    return generate;
}(TG.Engines.Generate || {}, TG.Objects));