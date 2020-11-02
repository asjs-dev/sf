SF.Player = createClass(
  SF.AbstractShip,
  function Player(baseTexture) {
    SF.AbstractShip.call(this, baseTexture, SF.LightBeam.Type.Blue);

    this._DECELERATION = SF.Config.player.deceleration;

    this._hitTestHelper.position.set(-30, 21);
    this._hitTestHelper.width  = 145;
    this._hitTestHelper.height = 38;

    this.type = SF.AbstractCollidable.Type.Player;

    this._container.scale.set(0.5);

    this._cabin.texture  = SF.TextureAtlas.getTexture(this._baseTexture, "PlayerCabin");
    this._body.texture   = SF.TextureAtlas.getTexture(this._baseTexture, "PlayerBody");
    this._engine.texture = SF.TextureAtlas.getTexture(this._baseTexture, "PlayerEngine");
    this._wing.texture   = SF.TextureAtlas.getTexture(this._baseTexture, "PlayerWing");
    this._gun.texture    = SF.TextureAtlas.getTexture(this._baseTexture, "PlayerGun");
    this._wing.anchor.set(0.5);
  },
  function(_scope, _super) {
    _scope.reset = function(state) {
      _super.reset.call(this, state);

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

    _scope.destroy = function() {
      _super.destroy.call(this);
      this.destroyed = true;
    }

    _scope._customUpdate = function(state) {
      var timeScale = state.timeScale;

      var deceleration = this._DECELERATION * timeScale;
      this._container.x -= (this._container.x - state.player.targetPosition.x) * deceleration;
      this._container.y -= (this._container.y - state.player.targetPosition.y) * deceleration;

      this._container.rotation += (- this._container.rotation + Math.atan2(
        state.player.targetPosition.y - this._container.y,
        (state.player.targetPosition.x + 500) - this._container.x
      )) * 0.5 * timeScale;

      this._gun.rotation  =
      this._wing.rotation = - this._container.rotation * timeScale;
    }
  }
);
