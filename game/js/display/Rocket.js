SF.Rocket = createClass(
  SF.AbstractCollidable,
  function Rocket(baseTexture) {
    SF.AbstractCollidable.call(this, baseTexture);

    this._hitTestHelper.position.set(20, 29);
    this._hitTestHelper.width  = 26;
    this._hitTestHelper.height = 8;

    this.type = SF.AbstractCollidable.Type.Rocket;

    this._MAX_SPEED    = 30;
    this._SPEED        = 2.5;
    this._RIGHT_BORDER = SF.Config.size.width;

    this._container.scale.set(0.5);

    this._body = new PIXI.Sprite(SF.TextureAtlas.getTexture(this._baseTexture, "Rocket"));
    this._container.addChild(this._body);

    this._lightBeam = new SF.LightBeam(this._baseTexture);
    this._lightBeam.pixiEl.position.set(-54, 0);
    this._container.addChild(this._lightBeam.pixiEl);
  },
  function(_scope, _super) {
    _scope.reset = function(state, x, y) {
      _super.reset.call(this);

      this.isAbleToCollide = true;

      this._container.x = x + 32;
      this._container.y = y + 7.5;

      this._acceleration = 0.001;

      this._lightBeam.reset(state);
    }

    _scope.update = function(state) {
      this._acceleration = Math.min(this._MAX_SPEED, this._acceleration * this._SPEED);

      this._container.x += this._acceleration * state.timeScale;

      this._lightBeam.update(state);

      if (this._container.x > this._RIGHT_BORDER) this.removable = true;
    }

    _scope.destroy = function() {}

    _scope._customDestruct = function() {
      this._container.removeChild(this._body);
      this._container.removeChild(this._lightBeam.pixiEl);

      this._lightBeam.destruct();
    }
  }
);
