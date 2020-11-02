import Config from "../Config.js";
import AbstractCollidable from "./AbstractCollidable.js";

export default class AbstractBreakable extends AbstractCollidable {
  constructor(baseTexture) {
    super(baseTexture);

    this._BREAKING_SPEED = Config.breakingSpeed;
  }

  reset(state) {
    super.reset();

    this._isBreakingApart = false;
  }

  update(state) {
    this._isBreakingApart && this._updateBreaking(state);
  }

  breakApart() {
    this._isBreakingApart = true;
  }

  _resetItem(item) {
    item.rotation = 0;
    item.alpha    = 1;
    item.position.set(0);
  }

  _updateBreaking(state) {}

  _updateItemBreaking(state, item) {
    const {timeScale} = state;

    item.rotation += 0.01 * timeScale;
    item.alpha    -= 0.01 * timeScale;

    const speed = this._BREAKING_SPEED * timeScale;
    item.x += Math.sin(item.rotation) * speed;
    item.y += Math.cos(item.rotation) * speed;
  }
};
