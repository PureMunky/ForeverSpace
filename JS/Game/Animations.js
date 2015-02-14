TG.Game.Animations = (function (a, g) {
  'use strict';

  var that = {};

  var _Character = function (inImage, defaultAnimation) {
    var _render = new a.Render(inImage, 16, 16, 0, 0);
    var _Walk = new a.Sequence();
    _Walk.addFrame(new a.Frame(null, 0, 20));
    _Walk.addFrame(new a.Frame(null, 16, 20));
    _Walk.addFrame(new a.Frame(null, 32, 20));
    _Walk.addFrame(new a.Frame(null, 48, 20));
    _render.addAnimation(_Walk, 'walk');

    var _Idle = new a.Sequence();
    _Idle.addFrame(new a.Frame(64, 0, 100));
    _Idle.addFrame(new a.Frame(64, 16, 100));
    _Idle.addFrame(new a.Frame(64, 32, 100));
    _render.addAnimation(_Idle, 'idle');

    var _AttackMelee = new a.Sequence(true);
    _AttackMelee.addFrame(new a.Frame(null, 64, 10));
    _AttackMelee.addFrame(new a.Frame(null, 80, 10));
    _render.addAnimation(_AttackMelee, 'attackMelee');

    var _Dead = new a.Sequence();
    _Dead.addFrame(new a.Frame(64, 0, 1000));
    _render.addAnimation(_Dead, 'dead');

    return _render;
  }

  var _CharacterDemo = function (inImage, defaultAnimation) {
    var _render = new a.Render(inImage, 32, 32, 0, 0);
    var _Walk = new a.Sequence();
    _Walk.addFrame(new a.Frame(0, null, .2));
    _Walk.addFrame(new a.Frame(32, null, .2));
    _Walk.addFrame(new a.Frame(64, null, .2));
    _Walk.addFrame(new a.Frame(32, null, .2));
    _render.addAnimation(_Walk, 'walk');

    var _Idle = new a.Sequence();
    _Idle.addFrame(new a.Frame(32, 0, 4));
    _Idle.addFrame(new a.Frame(32, 0, 4));
    _render.addAnimation(_Idle, 'idle');

    var _AttackMelee = new a.Sequence(true);
    _AttackMelee.addFrame(new a.Frame(null, 64, 1));
    _AttackMelee.addFrame(new a.Frame(null, 80, 1));
    _render.addAnimation(_AttackMelee, 'attackMelee');

    var _Dead = new a.Sequence();
    _Dead.addFrame(new a.Frame(64, 0, 1000));
    _render.addAnimation(_Dead, 'dead');

    return _render;
  }

  var _Plant = function (inImage, defaultAnimation) {
    var _render = new a.Render(inImage, 16, 16, 0, 0);
    var _SlowBreeze = new a.Sequence();
    _SlowBreeze.addFrame(new a.Frame(0, 0, 40));
    _SlowBreeze.addFrame(new a.Frame(0, 16, 40));
    _SlowBreeze.addFrame(new a.Frame(0, 32, 40));
    _SlowBreeze.addFrame(new a.Frame(0, 48, 40));
    _SlowBreeze.addFrame(new a.Frame(0, 64, 40));
    _render.addAnimation(_SlowBreeze, 'slowBreeze');

    var _FastBreeze = new a.Sequence();
    _FastBreeze.addFrame(new a.Frame(16, 0, 10));
    _FastBreeze.addFrame(new a.Frame(16, 16, 10));
    _FastBreeze.addFrame(new a.Frame(16, 32, 10));
    _FastBreeze.addFrame(new a.Frame(16, 48, 10));
    _FastBreeze.addFrame(new a.Frame(16, 64, 10));
    _render.addAnimation(_FastBreeze, 'fastBreeze');

    return _render;
  }

  var _Water = function (inImage, defaultAnimation) {
    var _render = new a.Render(inImage, 16, 16, 0, 0);
    var _SlowBreeze = new a.Sequence();
    _SlowBreeze.addFrame(new a.Frame(0, 0, .4));
    _SlowBreeze.addFrame(new a.Frame(0, 16, .4));
    _SlowBreeze.addFrame(new a.Frame(0, 32, .4));
    _SlowBreeze.addFrame(new a.Frame(0, 48, .4));
    _SlowBreeze.addFrame(new a.Frame(0, 64, .4));
    _render.addAnimation(_SlowBreeze, 'slowBreeze');

    var _FastBreeze = new a.Sequence();
    _FastBreeze.addFrame(new a.Frame(16, 0, .1));
    _FastBreeze.addFrame(new a.Frame(16, 16, .1));
    _FastBreeze.addFrame(new a.Frame(16, 32, .1));
    _FastBreeze.addFrame(new a.Frame(16, 48, .1));
    _FastBreeze.addFrame(new a.Frame(16, 64, .1));
    _render.addAnimation(_FastBreeze, 'fastBreeze');

    return _render;
  }

  var _Star = function (inImage, defaultAnimation) {
    var _render = new a.Render(inImage, 1, 1, 0, 0);
    var _Static = new a.Sequence();
    _Static.addFrame(new a.Frame(0, 0, 100));
    _render.addAnimation(_Static, 'static');

    return _render;
  };

  that.Player = function (defaultAnimation) {
    return _Character(g._PlayerImage, defaultAnimation);
  };

  that.Demo = function (defaultAnimation) {
    return _CharacterDemo(g._PlayerImageDemo, defaultAnimation);
  }

  that.NPCMale = function (defaulAnimation) {
    return _CharacterDemo(g._NPCMale, defaulAnimation);
  }

  that.NPCFemale = function (defaulAnimation) {
    return _CharacterDemo(g._NPCFemale, defaulAnimation);
  }

  that.NPCPony = function (defaulAnimation) {
    return _CharacterDemo(g._NPCPony, defaulAnimation);
  }

  that.Plant = function (defaultAnimation) {
    return _Plant(g._PlantImage, defaultAnimation);
  };

  that.Water = function (defaultAnimation) {
    return _Plant(g._WaterImage, defaultAnimation);
  };

  that.Star = function () {
    return _Star(g._StarImage, 'static');
  };

  that.Bullet = function () {
    var _render = new a.Render(g._BulletImage, 2, 2, 0, 0);
    var _Static = new a.Sequence();
    _Static.addFrame(new a.Frame(0, 0, 100));
    _render.addAnimation(_Static, 'static');

    return _render;
  }

  that.Generic = function (ImageSrc, height, width, posX, posY) {
    return function () {
      var _render = new a.Render(ImageSrc, height, width, posX, posY);
      var _Static = new a.Sequence();
      _Static.addFrame(new a.Frame(0, 0, 100));
      _render.addAnimation(_Static, 'static');

      return _render;
    };
  }

  return that;
})(TG.Objects.Render, TG.Engine.GlobalVars);
