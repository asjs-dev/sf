SF.AbstractCollidable = createClass(
  SF.AbstractRenderable,
  function AbstractCollidable(baseTexture) {
    SF.AbstractRenderable.call(this, baseTexture);

    this._hitTestHelper = new PIXI.Sprite(SF.TextureAtlas.getTexture(this._baseTexture, "HitTestHelper"));
    this._container.addChild(this._hitTestHelper);

    this.type = SF.AbstractCollidable.Type.Neutral;
  },
  function(_scope, _super) {
    _scope.reset = function() {
      _super.reset.call(this);
      this.isAbleToCollide = false;
    }

    _scope.getBounds = function() {
      return this._hitTestHelper.getBounds();
    }

    _scope.destruct = function() {
      _super.destruct.call(this);
      this._container.removeChild(this._hitTestHelper);
    }
  }
);
SF.AbstractCollidable.Type = {
  Player    : "player",
  Rocket    : "rocket",
  Enemy     : "enemy",
  Neutral   : "neutral",
  Extension : "extension"
}
