SF.EnemyMeteor = class EnemyMeteor extends SF.AbstractBreakable {
  constructor(baseTexture) {
    super(baseTexture);

    this._hitTestHelper.position.set(-23, -19);
    this._hitTestHelper.width  = 50;
    this._hitTestHelper.height = 43;

    this.type = SF.AbstractCollidable.Type.Enemy;

    this._container.pivot.set(0.5);

    this._meteor = new PIXI.Sprite();
    this._meteor.anchor.set(0.5);
    this._container.addChild(this._meteor);
  }

  reset(state) {
    super.reset(state);

    this.isAbleToCollide = true;

    const enemyConfig  = SF.Config.enemy;
    const meteorConfig = enemyConfig.meteor;
    const sizeConfig   = SF.Config.size;

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

  update(state) {
    super.update(state);

    if (!this._isBreakingApart) {
      const {timeScale} = state;

      this._container.x        -= this._SPEED * timeScale;
      this._container.rotation += this._ROTATION_SPEED * timeScale;
    }

    if (this._container.x < this._leftBorder) this.removable = true;
  }

  destroy() {
    this.isAbleToCollide = false;
    this.breakApart();
  }

  breakApart() {
    super.breakApart();

    this._meteor.rotation = Math.random() * 180;
  }

  _updateBreaking(state) {
    this._updateItemBreaking(state, this._meteor);

    if (this._meteor.alpha < 0) this.removable = true;
  }

  _customDestruct() {
    this._container.removeChild(this._meteor);
  }
};
SF.EnemyMeteor.MeteorIds = [
  "MeteorA",
  "MeteorB"
];
