TG.Engines.Generate = (function (generate, o) {
    function _NPC(inTitle, inPosition) {
        var newNPC = new o.NPC(inTitle, inPosition);

        newNPC.setAI(TG.Engines.AI.weave(300));

        return newNPC;
    }

    generate.NPC = function (inTitle, inPosition) {
        return _NPC(inTitle, inPosition);
    };

    return generate;
}(TG.Engines.Generate || {}, TG.Objects));