import AbstractBreakable from "./AbstractBreakable.js";
import LightBeam from "./LightBeam.js";

export default class AbstractShip extends AbstractBreakable {
  constructor(baseTexture, lightBeamType) {
    super(baseTexture);

    this._cabin = new PIXI.Sprite();
    this._container.addChild(this._cabin);

    this._body = new PIXI.Sprite();
    this._container.addChild(this._body);

    this._engine = new PIXI.Sprite();
    this._container.addChild(this._engine);

    this._wing = new PIXI.Sprite();
    this._container.addChild(this._wing);

    this._lightBeam = new LightBeam(
      this._baseTexture,
      lightBeamType
    );
    this._container.addChild(this._lightBeam.pixiEl);

    this._gun = new PIXI.Sprite();
    this._container.addChild(this._gun);
  }

  reset(state) {
    super.reset(state);

    this._resetItem(this._cabin);
    this._resetItem(this._body);
    this._resetItem(this._engine);
    this._resetItem(this._wing);
    this._resetItem(this._gun);

    this._lightBeam.reset(state);
  }

  update(state) {
    super.update(state);

    this._customUpdate(state);
    this._lightBeam.update(state);
  }

  destroy() {
    this.isAbleToCollide = false;
    this.breakApart();
  }

  breakApart() {
    super.breakApart();

    this._cabin.rotation  = Math.random() * 180;
    this._body.rotation   = Math.random() * 180;
    this._engine.rotation = Math.random() * 180;
    this._wing.rotation   = Math.random() * 180;
    this._gun.rotation    = Math.random() * 180;

    this._lightBeam.breakApart();
  }

  _updateBreaking(state) {
    this._updateItemBreaking(state, this._cabin);
    this._updateItemBreaking(state, this._body);
    this._updateItemBreaking(state, this._engine);
    this._updateItemBreaking(state, this._wing);
    this._updateItemBreaking(state, this._gun);

    if (this._body.alpha < 0) this.removable = true;
  }

  _customDestruct() {
    this._container.removeChild(this._body);
    this._container.removeChild(this._lightBeam.pixiEl);
    this._container.removeChild(this._cabin);
    this._container.removeChild(this._engine);
    this._container.removeChild(this._wing);
    this._container.removeChild(this._gun);

    this._lightBeam.destruct();
  }

  _customUpdate(state) {}
};
