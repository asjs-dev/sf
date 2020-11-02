SF.Ammo = createClass(
  SF.AbstractCollidable,
  function Ammo(baseTexture) {
    SF.AbstractCollidable.call(this, baseTexture);

    this._SPEED = SF.Config.extension.speed;

    this._hitTestHelper.position.set(10, 7);
    this._hitTestHelper.width  = 46;
    this._hitTestHelper.height = 52;

    this._container.scale.set(0.75);

    this.type = SF.AbstractCollidable.Type.Extension;

    this._body = new PIXI.Sprite(SF.TextureAtlas.getTexture(this._baseTexture, "Ammo"));
    this._container.addChild(this._body);

    this._leftBorder = -this._container.width;
  },
  function(_scope, _super) {
    _scope.reset = function(state) {
      _super.reset.call(this);

      this.isAbleToCollide = true;

      var ammoConfig = SF.Config.extension.ammo;
      var sizeConfig = SF.Config.size;

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

    _scope.update = function(state) {
      this._container.x -= this._SPEED * state.timeScale;

      if (this._container.x < this._leftBorder) this.removable = true;
    }

    _scope.destroy = function() {
      this.removable = true;
    }

    _scope._customDestruct = function() {
      this._container.removeChild(this._body);
    }
  }
);
