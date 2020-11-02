import Config from "../Config.js";
import LightBeam from "./LightBeam.js";
import TextureAtlas from "../helper/TextureAtlas.js";
import AbstractCollidable from "./AbstractCollidable.js";
import AbstractShip from "./AbstractShip.js";

export default class Player extends AbstractShip {
  constructor(baseTexture) {
    super(baseTexture, LightBeam.Type.Blue);

    this._DECELERATION = Config.player.deceleration;

    this._hitTestHelper.position.set(-30, 21);
    this._hitTestHelper.width  = 145;
    this._hitTestHelper.height = 38;

    this.type = AbstractCollidable.Type.Player;

    this._container.scale.set(0.5);

    this._cabin.texture  = TextureAtlas.getTexture(this._baseTexture, "PlayerCabin");
    this._body.texture   = TextureAtlas.getTexture(this._baseTexture, "PlayerBody");
    this._engine.texture = TextureAtlas.getTexture(this._baseTexture, "PlayerEngine");
    this._wing.texture   = TextureAtlas.getTexture(this._baseTexture, "PlayerWing");
    this._gun.texture    = TextureAtlas.getTexture(this._baseTexture, "PlayerGun");
    this._wing.anchor.set(0.5);
  }

  reset(state) {
    super.reset(state);

    this.isAbleToCollide = true;

    this.destroyed =
    this.exploding = false;

    this._container.x = -300;
    this._container.y = state.player.targetPosition.y;

    this._body.position.set(-13, 5);
    this._engine.position.set(-43, 2);
    this._wing.position.set(-1, 39);
    this._lightBeam.pixiEl.position.set(-90, 3);
    this._gun.position.set(24, 15);
  }

  destroy() {
    super.destroy();

    this.destroyed = true;
  }

  _customUpdate(state) {
    const {timeScale} = state;

    const deceleration = this._DECELERATION * timeScale;
    this._container.x -= (this._container.x - state.player.targetPosition.x) * deceleration;
    this._container.y -= (this._container.y - state.player.targetPosition.y) * deceleration;

    this._container.rotation += (- this._container.rotation + Math.atan2(
      state.player.targetPosition.y - this._container.y,
      (state.player.targetPosition.x + 500) - this._container.x
    )) * 0.5 * timeScale;

    this._gun.rotation  =
    this._wing.rotation = - this._container.rotation * timeScale;
  }
};
