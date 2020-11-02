import {intToRgb, getAnimatedColor, easeInOut} from "../utility/utils.js";
import Config from "../Config.js";
import TextureAtlas from "../helper/TextureAtlas.js";
import AbstractRenderable from "./AbstractRenderable.js";

export default class ColorizedBackground extends AbstractRenderable {
  constructor(baseTexture, id, width, height) {
    super(baseTexture);

    this._SPEED     = Config.bgColorChangingSpeed;
    this._MAX_STEPS = 1 + this._SPEED;

    this._item        = new PIXI.Sprite(TextureAtlas.getTexture(this._baseTexture, id));
    this._item.width  = width;
    this._item.height = height;
    this._container.addChild(this._item);

    this._step = 1;
    this._latestColor = {
      r : 0,
      g : 0,
      b : 0
    };
    this._targetColor = {
      r : 0,
      g : 0,
      b : 0
    };
  }

  get color() {
    return this._item.tint;
  }

  set color(v) {
    const targetColor = intToRgb(v);
    if (this._targetColor !== targetColor) {
      this._targetColor = targetColor;
      this._latestColor = intToRgb(this._item.tint);
      this._step = 0;
    }
  }

  update(timeScale) {
    this._step += this._SPEED * timeScale;
    if (this._step < this._MAX_STEPS)
      this._item.tint = getAnimatedColor(this._latestColor, this._targetColor, easeInOut(this._step));
  }
};
