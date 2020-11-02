import AbstractRenderable from "./AbstractRenderable.js";
import TextureAtlas from "../helper/TextureAtlas.js";

export default class AbstractCollidable extends AbstractRenderable {
  constructor(baseTexture) {
    super(baseTexture);

    this._hitTestHelper = new PIXI.Sprite(TextureAtlas.getTexture(this._baseTexture, "HitTestHelper"));
    this._container.addChild(this._hitTestHelper);

    this.type = AbstractCollidable.Type.Neutral;
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

AbstractCollidable.Type = {
  Player    : "player",
  Rocket    : "rocket",
  Enemy     : "enemy",
  Neutral   : "neutral",
  Extension : "extension"
}
