import {between, getRandomFromArray} from "../utility/utils.js";
import Config from "../Config.js";
import TextureAtlas from "../helper/TextureAtlas.js";
import LightBeam from "./LightBeam.js";
import AbstractCollidable from "./AbstractCollidable.js";
import AbstractShip from "./AbstractShip.js";

export default class EnemyShip extends AbstractShip {
  constructor(baseTexture) {
    super(baseTexture, LightBeam.Type.Red);

    this._hitTestHelper.position.set(-20, 10);
    this._hitTestHelper.width  = 122;
    this._hitTestHelper.height = 60;

    this.type = AbstractCollidable.Type.Enemy;

    this._container.scale.set(-0.5, 0.5);

    this._wing.anchor.set(0.5);
  }

  reset(state) {
    super.reset(state);

    this.isAbleToCollide = true;

    const enemyConfig    = Config.enemy;
    const gameAreaConfig = Config.gameArea;

    this._SPEED = between(
      enemyConfig.minSpeed,
      enemyConfig.maxSpeed,
      Math.random() * enemyConfig.maxSpeed
    );

    this._container.x = Config.size.width + 100;
    this._container.y = between(
      gameAreaConfig.y,
      gameAreaConfig.height,
      Math.random() * gameAreaConfig.height
    );

    this._verticalMovement = -0.25 + Math.random() * 0.5;

    const bodyStyle = getRandomFromArray(Math.random(), EnemyShip.BodyStyles);

    this._cabin.texture = TextureAtlas.getTexture(this._baseTexture, "EnemyCabin");
    this._cabin.position.set(
      bodyStyle.cabin.x,
      bodyStyle.cabin.y
    );

    this._body.texture = TextureAtlas.getTexture(this._baseTexture, bodyStyle.bodyId);
    this._body.position.set(-13, 5);

    this._engine.texture = TextureAtlas.getTexture(
      this._baseTexture,
      getRandomFromArray(Math.random(), EnemyShip.EngineStyles)
    );
    this._engine.position.set(-17, 13);

    this._wing.texture = TextureAtlas.getTexture(
      this._baseTexture,
      getRandomFromArray(Math.random(), EnemyShip.WingStyles)
    );
    this._wing.position.set(25, 45);

    this._lightBeam.pixiEl.position.set(-80, 13);

    this._bounds = this._container.getBounds();
  }

  _customUpdate(state) {
    const gameAreaConfig = Config.gameArea;

    this._container.x -= this._SPEED * state.timeScale;

    if (Math.floor(Math.random() * 100) === 0) this._verticalMovement = -0.25 + Math.random() * 0.5;
    this._container.y += this._SPEED * this._verticalMovement * state.timeScale;
    if (this._container.y < gameAreaConfig.y || this._container.y + this._bounds.height > gameAreaConfig.height)
      this._verticalMovement *= -1;

    if (this._container.x < -this._bounds.width) this.removable = true;
  }
};

EnemyShip.BodyStyles = [
  {
    bodyId : "EnemyBodyA",
    cabin  : new PIXI.Point(40, 5),
  },
  {
    bodyId : "EnemyBodyB",
    cabin  : new PIXI.Point(48, -2),
  }
];

EnemyShip.EngineStyles = [
  "EnemyEngineA",
  "EnemyEngineB"
];

EnemyShip.WingStyles = [
  "EnemyWingA",
  "EnemyWingB"
];
