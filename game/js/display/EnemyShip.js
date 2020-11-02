SF.EnemyShip = createClass(
  SF.AbstractShip,
  function EnemyShip(baseTexture) {
    SF.AbstractShip.call(this, baseTexture, SF.LightBeam.Type.Red);

    this._hitTestHelper.position.set(-20, 10);
    this._hitTestHelper.width  = 122;
    this._hitTestHelper.height = 60;

    this.type = SF.AbstractCollidable.Type.Enemy;

    this._container.scale.set(-0.5, 0.5);

    this._wing.anchor.set(0.5);
  },
  function(_scope, _super) {
    _scope.reset = function(state) {
      _super.reset.call(this, state);

      this.isAbleToCollide = true;

      var enemyConfig    = SF.Config.enemy;
      var gameAreaConfig = SF.Config.gameArea;

      this._SPEED = between(
        enemyConfig.minSpeed,
        enemyConfig.maxSpeed,
        Math.random() * enemyConfig.maxSpeed
      );

      this._container.x = SF.Config.size.width + 100;
      this._container.y = between(
        gameAreaConfig.y,
        gameAreaConfig.height,
        Math.random() * gameAreaConfig.height
      );

      this._verticalMovement = -0.25 + Math.random() * 0.5;

      var bodyStyle = getRandomFromArray(Math.random(), SF.EnemyShip.BodyStyles);

      this._cabin.texture = SF.TextureAtlas.getTexture(this._baseTexture, "EnemyCabin");
      this._cabin.position.set(
        bodyStyle.cabin.x,
        bodyStyle.cabin.y
      );

      this._body.texture = SF.TextureAtlas.getTexture(this._baseTexture, bodyStyle.bodyId);
      this._body.position.set(-13, 5);

      this._engine.texture = SF.TextureAtlas.getTexture(
        this._baseTexture,
        getRandomFromArray(Math.random(), SF.EnemyShip.EngineStyles)
      );
      this._engine.position.set(-17, 13);

      this._wing.texture = SF.TextureAtlas.getTexture(
        this._baseTexture,
        getRandomFromArray(Math.random(), SF.EnemyShip.WingStyles)
      );
      this._wing.position.set(25, 45);

      this._lightBeam.pixiEl.position.set(-80, 13);

      this._bounds = this._container.getBounds();
    }

    _scope._customUpdate = function(state) {
      var gameAreaConfig = SF.Config.gameArea;

      this._container.x -= this._SPEED * state.timeScale;

      if (Math.floor(Math.random() * 100) === 0) this._verticalMovement = -0.25 + Math.random() * 0.5;
      this._container.y += this._SPEED * this._verticalMovement * state.timeScale;
      if (this._container.y < gameAreaConfig.y || this._container.y + this._bounds.height > gameAreaConfig.height)
        this._verticalMovement *= -1;

      if (this._container.x < -this._bounds.width) this.removable = true;
    }
  }
);
SF.EnemyShip.BodyStyles = [
  {
    bodyId : "EnemyBodyA",
    cabin  : new PIXI.Point(40, 5),
  },
  {
    bodyId : "EnemyBodyB",
    cabin  : new PIXI.Point(48, -2),
  }
];
SF.EnemyShip.EngineStyles = [
  "EnemyEngineA",
  "EnemyEngineB"
];
SF.EnemyShip.WingStyles = [
  "EnemyWingA",
  "EnemyWingB"
];
