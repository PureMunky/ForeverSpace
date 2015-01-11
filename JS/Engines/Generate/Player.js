﻿TG.Engines.Generate = (function (generate, o) {

    function _Player(inName, inSex, inPosition) {
        var newPlayer = new o.NPC(inName, inSex, inPosition);

        return newPlayer;
    }

    generate.Player = function (inName, inSex, inPosition) {
        return _Player(inName, inSex, inPosition);
    };

    return generate;
}(TG.Engines.Generate || {}, TG.Objects));