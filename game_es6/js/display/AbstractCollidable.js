SF.AbstractCollidable = class AbstractCollidable extends SF.AbstractRenderable {
  constructor(baseTexture) {
    super(baseTexture);

    this._hitTestHelper = new PIXI.Sprite(SF.TextureAtlas.getTexture(this._baseTexture, "HitTestHelper"));
    this._container.addChild(this._hitTestHelper);

    this.type = SF.AbstractCollidable.Type.Neutral;
  }

  reset() {
    super.reset();
    this.isAbleToCollide = false;
  }

  getBounds() {
    return this._hitTestHelper.getBounds();
  }

  destruct() {
    super.destruct();
    this._container.removeChild(this._hitTestHelper);
  }
};
SF.AbstractCollidable.Type = {
  Player    : "player",
  Rocket    : "rocket",
  Enemy     : "enemy",
  Neutral   : "neutral",
  Extension : "extension"
}
