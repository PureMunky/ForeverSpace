TG.Game.Generate = (function (generate, o) {
  function _NPC(inTitle, inPosition, inDifficulty) {
    var newNPC = new o.NPC(inTitle, inPosition, inDifficulty);

    newNPC.setAI(TG.Game.AI.weave(100));

    return newNPC;
  }

  generate.NPC = function (inTitle, inPosition, inDifficulty) {
    return _NPC(inTitle, inPosition, inDifficulty);
  };

  return generate;
}(TG.Game.Generate || {}, TG.Game.Objects));