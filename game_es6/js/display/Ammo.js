import {between} from "../utility/utils.js";
import Config from "../Config.js";
import TextureAtlas from "../helper/TextureAtlas.js";
import AbstractCollidable from "./AbstractCollidable.js";

export default class Ammo extends AbstractCollidable {
  constructor(baseTexture) {
    super(baseTexture);

    this._SPEED = Config.extension.speed;

    this._hitTestHelper.position.set(10, 7);
    this._hitTestHelper.width  = 46;
    this._hitTestHelper.height = 52;

    this._container.scale.set(0.75);

    this.type = AbstractCollidable.Type.Extension;

    this._body = new PIXI.Sprite(TextureAtlas.getTexture(this._baseTexture, "Ammo"));
    this._container.addChild(this._body);

    this._leftBorder = -this._container.width;
  }

  reset(state) {
    super.reset();

    this.isAbleToCollide = true;

    const ammoConfig = Config.extension.ammo;
    const sizeConfig = Config.size;

    this.VALUE = between(
      ammoConfig.minValue,
      ammoConfig.maxValue,
      Math.floor(Math.random() * ammoConfig.maxValue)
    );

    this._container.x = sizeConfig.width + 100;
    this._container.y = between(
      60,
      sizeConfig.height - 100,
      Math.random() * sizeConfig.height
    );
  }

  update(state) {
    this._container.x -= this._SPEED * state.timeScale;

    if (this._container.x < this._leftBorder) this.removable = true;
  }

  destroy() {
    this.removable = true;
  }

  _customDestruct() {
    this._container.removeChild(this._body);
  }
};
