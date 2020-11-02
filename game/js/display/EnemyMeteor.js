SF.EnemyMeteor = createClass(
  SF.AbstractBreakable,
  function EnemyMeteor(baseTexture) {
    SF.AbstractBreakable.call(this, baseTexture);

    this._hitTestHelper.position.set(-23, -19);
    this._hitTestHelper.width  = 50;
    this._hitTestHelper.height = 43;

    this.type = SF.AbstractCollidable.Type.Enemy;

    this._container.pivot.set(0.5);

    this._meteor = new PIXI.Sprite();
    this._meteor.anchor.set(0.5);
    this._container.addChild(this._meteor);
  },
  function(_scope, _super) {
    _scope.reset = function(state) {
      _super.reset.call(this, state);

      this.isAbleToCollide = true;

      var enemyConfig  = SF.Config.enemy;
      var meteorConfig = enemyConfig.meteor;
      var sizeConfig   = SF.Config.size;

      this._SPEED = between(
        enemyConfig.minSpeed,
        enemyConfig.maxSpeed,
        Math.random() * enemyConfig.maxSpeed
      );
      this._ROTATION_SPEED = Math.random() * meteorConfig.maxRotation;

      this._container.scale.set(between(
        meteorConfig.minScale,
        meteorConfig.maxScale,
        Math.random() * meteorConfig.maxScale
      ));
      this._container.x = sizeConfig.width + 100;
      this._container.y = between(
        72,
        sizeConfig.height - 100,
        Math.random() * sizeConfig.height
      );

      this._resetItem(this._meteor);

      this._meteor.texture = SF.TextureAtlas.getTexture(
        this._baseTexture,
        getRandomFromArray(Math.random(), SF.EnemyMeteor.MeteorIds)
      );

      this._leftBorder = -this._container.width;
    }

    _scope.update = function(state) {
      _super.update.call(this, state);

      if (!this._isBreakingApart) {
        var timeScale = state.timeScale;

        this._container.x        -= this._SPEED * timeScale;
        this._container.rotation += this._ROTATION_SPEED * timeScale;
      }

      if (this._container.x < this._leftBorder) this.removable = true;
    }

    _scope.destroy = function() {
      this.isAbleToCollide = false;
      this.breakApart();
    }

    _scope.breakApart = function() {
      _super.breakApart.call(this);

      this._meteor.rotation = Math.random() * 180;
    }

    _scope._updateBreaking = function(state) {
      this._updateItemBreaking(state, this._meteor);

      if (this._meteor.alpha < 0) this.removable = true;
    }

    _scope._customDestruct = function() {
      this._container.removeChild(this._meteor);
    }
  }
);
SF.EnemyMeteor.MeteorIds = [
  "MeteorA",
  "MeteorB"
];
