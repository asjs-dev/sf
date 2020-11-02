import {between, addClass, removeClass, getTwoRectsCenter, is} from "../utility/utils.js";
import Config from "../Config.js";
import LevelMenuBackground from "../level/LevelMenuBackground.js";
import LevelPlanet from "../level/LevelPlanet.js";
import LevelSpace from "../level/LevelSpace.js";
import LevelWormHole from "../level/LevelWormHole.js";
import ElementRecycler from "../helper/ElementRecycler.js";
import Keyboard from "../helper/Keyboard.js";
import Player from "../display/Player.js";
import Rocket from "../display/Rocket.js";
import EnemyMeteor from "../display/EnemyMeteor.js";
import EnemyShip from "../display/EnemyShip.js";
import Explosion from "../display/Explosion.js";
import LevelElement from "../display/LevelElement.js";
import Ammo from "../display/Ammo.js";
import AbstractCollidable from "../display/AbstractCollidable.js";
import DetectCollisions from "../helper/DetectCollisions.js";
import AbstractViewController from "./AbstractViewController.js";

export default class GameViewController extends AbstractViewController {
  constructor(dataObserver, renderer, baseTexture) {
    super(dataObserver);

    this._LEVELS = {
      "menu"      : new LevelMenuBackground(),
      "planet"    : new LevelPlanet(),
      "space"     : new LevelSpace(),
      "worm-hole" : new LevelWormHole()
    };

    this._KEYS_UP    = Config.keys.up;
    this._KEYS_RIGHT = Config.keys.right;
    this._KEYS_DOWN  = Config.keys.down;
    this._KEYS_LEFT  = Config.keys.left;

    this._BULLET_TIME_SPEED        = Config.bulletTime.speed;
    this._BULLET_TIME_DECELERATION = Config.bulletTime.deceleration;

    this._GAME_AREA = Config.gameArea;

    this._PLAYER_SHOT_DELAY       = Config.player.shotDelay;
    this._PLAYER_DEFAULT_POSITION = Config.defaultState.player.targetPosition;
    this._PLAYER_SPEED            = Config.player.speed;

    this._ENEMY_DELAY         = Config.enemy.delay;
    this._ENEMY_METEOR_CHANCE = Config.enemy.meteor.chance;

    this._EXTENSION_CHANCE = Config.extension.chance;

    this._MAX_ROCKETS = Config.maxRockets;

    this._LEVEL_ELEMENT_CHANCE = Config.level.element.chance;

    this._container = document.querySelector(".game-screen");

    this._renderer = renderer;

    this._baseTexture = baseTexture;

    this._container.appendChild(this._renderer.view);

    this._level;

    this._recycler = new ElementRecycler();

    this._keyboard = new Keyboard();

    this._collisionDetectedBound = this._collisionDetected.bind(this);

    this._rocketLaunchRequested = false;

    this._container.addEventListener("click", this._onClick.bind(this));

    this._dataObserver.on("", this._onDOChange.bind(this));
  }

  update(state) {
    this._updateMovement(state);
    this._updatePlayer(state);
    this._updateRockets(state);
    this._updateEnemies(state);
    this._updateExtensions(state);
    this._updateEnvironment(state);
    this._detectCollisions(state);
    this._updateRenderer(state);

    this._updateElements(state, this._renderer.backgroundStage.children);
    this._updateElements(state, this._renderer.stage.children);

    this._level && this._level.update(state);
  }

  _updateMovement(state) {
    let horizontalMovement = 0;
    this._keyboard.isPressed(this._KEYS_RIGHT) && (horizontalMovement = 1);
    this._keyboard.isPressed(this._KEYS_LEFT) && (horizontalMovement = -1);

    let verticalMovement = 0;
    this._keyboard.isPressed(this._KEYS_UP) && (verticalMovement = -1);
    this._keyboard.isPressed(this._KEYS_DOWN) && (verticalMovement = 1);

    const speed = this._PLAYER_SPEED * state.timeScale;

    state.player.targetPosition.x = between(
      this._GAME_AREA.x,
      this._GAME_AREA.width,
      state.player.targetPosition.x + horizontalMovement * speed
    );

    state.player.targetPosition.y = between(
      this._GAME_AREA.y,
      this._GAME_AREA.height,
      state.player.targetPosition.y + verticalMovement * speed
    );
  }

  _updatePlayer(state) {
    if (this._player) {
      if (this._player.destroyed) {
        if (!this._player.exploding) {
          this._player.exploding = true;
          this._renderer.backgroundColor = 0xFF0000;
        }
        state.timeScale = Math.max(this._BULLET_TIME_SPEED, this._BULLET_TIME_DECELERATION * state.timeScale);
      }
      this._player.removable && this._gameOver(state);
    }
    this._playerCreateRequested && this._createPlayer(state);
    this._playerCreateRequested = false;
  }

  _updateRockets(state) {
    if (
      state.view === "game" &&
      this._player &&
      !this._player.destroyed &&
      !this._player.removable &&
      state.status.rockets > 0 &&
      this._rocketLaunchRequested &&
      state.time - state.control.latestShot > this._PLAYER_SHOT_DELAY * (1 / state.timeScale)
    ) this._createRocket(state);

    this._rocketLaunchRequested = false;
  }

  _updateEnemies(state) {
    if (
      state.view === "game" &&
      state.time - state.latestEnemyTime > this._ENEMY_DELAY * (1 / state.timeScale)
    ) this._createEnemy(state);
  }

  _updateExtensions(state) {
    if (Math.floor(Math.random() * this._EXTENSION_CHANCE * (1 / state.timeScale)) === 0) this._createExtension(state);
  }

  _updateEnvironment(state) {
    if (this._level && Math.floor(Math.random() * this._LEVEL_ELEMENT_CHANCE * (1 / state.timeScale)) === 0)
      this._createLevelElement(state);
  }

  _playGame(state, levelId) {
    removeClass(this._container, "blur");

    this._setupLevel(state, levelId);
  }

  _showMenuBackground(state) {
    addClass(this._container, "blur");
    this._playerCreateRequested = true;

    this._setupLevel(state, "menu");
  }

  _setupLevel(state, levelId) {
    this._level = this._LEVELS[levelId];

    this._renderer.backgroundColor      = this._level.BACKGROUND_COLOR;
    this._renderer.backgroundFieldColor = this._level.FIELD_COLOR;
    state.timeScale                     = this._level.TIME_SCALE;
  }

  _createPlayer(state) {
    state.control.latestShot = state.time;
    state.status.rockets     = this._MAX_ROCKETS;
    state.status.kills       = 0;

    this._player = this._getElement(Player);
    this._player.reset(state);

    this._renderer.stage.addChild(this._player.pixiEl);
  }

  _createRocket(state) {
    state.control.latestShot = state.time;
    state.status.rockets--;

    const rocket = this._getElement(Rocket);

    rocket.reset(state, this._player.pixiEl.x, this._player.pixiEl.y);

    this._renderer.stage.addChild(rocket.pixiEl);
  }

  _createEnemy(state) {
    state.latestEnemyTime = state.time;

    const enemy = Math.floor(Math.random() * this._ENEMY_METEOR_CHANCE) === 0
      ? this._getElement(EnemyMeteor)
      : this._getElement(EnemyShip);

    enemy.reset(state);

    this._renderer.stage.addChild(enemy.pixiEl);
  }

  _createExplosion(state, x, y) {
    const explosion = this._getElement(Explosion);

    explosion.reset(state, x, y);

    this._renderer.stage.addChild(explosion.pixiEl);
  }

  _createLevelElement(state) {
    const levelElement = this._getElement(LevelElement);

    this._level.setupElement(state, levelElement);

    this._renderer.backgroundStage.addChild(levelElement.pixiEl);
    this._renderer.backgroundStage.sortChildren();
  }

  _createExtension(state) {
    const extension = this._getElement(Ammo);

    extension.reset(state);

    this._renderer.stage.addChild(extension.pixiEl);
  }

  _createExplosionFor(state, boundsA, boundsB) {
    const twoRectsCenter = getTwoRectsCenter(boundsA, boundsB);
    this._createExplosion(state, twoRectsCenter.x, twoRectsCenter.y);
  }

  _updateElements(state, elements) {
    for (let i = 0, l = elements.length; i < l; ++i) {
      let element = elements[i];
      let {owner} = element;

      if (owner.removable) {
        owner.removeFromStage();

        this._recycler.add(owner);

        --i;
        --l;
      } else owner.update(state);
    }
  }

  _collisionDetected(state, elementA, elementB, boundsA, boundsB) {
    if (
      this._checkTypes(
        elementA, elementB,
        AbstractCollidable.Type.Enemy, AbstractCollidable.Type.Player
      )
    ) {
      elementA.destroy();
      elementB.destroy();

      this._createExplosionFor(state, boundsA, boundsB);

      return true;
    } else if (
      this._checkTypes(
        elementA, elementB,
        AbstractCollidable.Type.Enemy, AbstractCollidable.Type.Rocket
      )
    ) {
      elementA.destroy();
      elementB.destroy();

      this._createExplosionFor(state, boundsA, boundsB);

      state.status.kills++;
    } else if (
      this._checkTypes(
        elementA, elementB,
        AbstractCollidable.Type.Extension, AbstractCollidable.Type.Player
      )
    ) {
      const extension = elementA.type === AbstractCollidable.Type.Extension
        ? elementA
        : elementB;

      if (is(extension, Ammo)) {
        state.status.rockets = Math.min(this._MAX_ROCKETS, state.status.rockets + extension.VALUE);
        extension.destroy();
      }
    }

    return false;
  }

  _detectCollisions(state) {
    if (state.view === "game")
      DetectCollisions(state, this._renderer.stage.children, this._collisionDetectedBound);
  }

  _checkTypes(elementA, elementB, typeA, typeB) {
    return (elementA.type === typeA && elementB.type === typeB) ||
           (elementB.type === typeA && elementA.type === typeB);
  }

  _updateRenderer(state) {
    this._renderer.update(state);
  }

  _getElement(type) {
    return this._recycler.get(type) || new type(this._baseTexture);
  }

  _gameOver(state) {
    state.view = "menu";

    state.player.targetPosition.x = this._PLAYER_DEFAULT_POSITION.x;
    state.player.targetPosition.y = this._PLAYER_DEFAULT_POSITION.y;
  }

  _onDOChange(state, prevState) {
    if (state.view !== prevState.view) {
      switch (state.view) {
        case "game" : this._playGame(state, state.levelId)
          break;
        case "menu" : this._showMenuBackground(state);
          break;
      }
      this._dataObserver.setState(state);
    }
  }

  _onClick() {
    this._rocketLaunchRequested = true;
  }
};
