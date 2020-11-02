SF.GameViewController = createClass(
  SF.AbstractViewController,
  function GameViewController(dataObserver, renderer, baseTexture) {
    SF.AbstractViewController.call(this, dataObserver);

    this._LEVELS = {
      "menu"      : new SF.LevelMenuBackground(),
      "planet"    : new SF.LevelPlanet(),
      "space"     : new SF.LevelSpace(),
      "worm-hole" : new SF.LevelWormHole()
    };

    this._KEYS_UP    = SF.Config.keys.up;
    this._KEYS_RIGHT = SF.Config.keys.right;
    this._KEYS_DOWN  = SF.Config.keys.down;
    this._KEYS_LEFT  = SF.Config.keys.left;

    this._BULLET_TIME_SPEED        = SF.Config.bulletTime.speed;
    this._BULLET_TIME_DECELERATION = SF.Config.bulletTime.deceleration;

    this._GAME_AREA = SF.Config.gameArea;

    this._PLAYER_SHOT_DELAY       = SF.Config.player.shotDelay;
    this._PLAYER_DEFAULT_POSITION = SF.Config.defaultState.player.targetPosition;
    this._PLAYER_SPEED            = SF.Config.player.speed;

    this._ENEMY_DELAY         = SF.Config.enemy.delay;
    this._ENEMY_METEOR_CHANCE = SF.Config.enemy.meteor.chance;

    this._EXTENSION_CHANCE = SF.Config.extension.chance;

    this._MAX_ROCKETS = SF.Config.maxRockets;

    this._LEVEL_ELEMENT_CHANCE = SF.Config.level.element.chance;

    this._container = document.querySelector(".game-screen");

    this._renderer = renderer;

    this._baseTexture = baseTexture;

    this._container.appendChild(this._renderer.view);

    this._level;

    this._recycler = new SF.ElementRecycler();

    this._keyboard = new SF.Keyboard();

    this._collisionDetectedBound = this._collisionDetected.bind(this);

    this._rocketLaunchRequested = false;

    this._container.addEventListener("click", this._onClick.bind(this));

    this._dataObserver.on("", this._onDOChange.bind(this));
  },
  function(_scope) {
    _scope.update = function(state) {
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

    _scope._updateMovement = function(state) {
      var horizontalMovement = 0;
      this._keyboard.isPressed(this._KEYS_RIGHT) && (horizontalMovement = 1);
      this._keyboard.isPressed(this._KEYS_LEFT) && (horizontalMovement = -1);

      var verticalMovement = 0;
      this._keyboard.isPressed(this._KEYS_UP) && (verticalMovement = -1);
      this._keyboard.isPressed(this._KEYS_DOWN) && (verticalMovement = 1);

      var speed = this._PLAYER_SPEED * state.timeScale;

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

    _scope._updatePlayer = function(state) {
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

    _scope._updateRockets = function(state) {
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

    _scope._updateEnemies = function(state) {
      if (
        state.view === "game" &&
        state.time - state.latestEnemyTime > this._ENEMY_DELAY * (1 / state.timeScale)
      ) this._createEnemy(state);
    }

    _scope._updateExtensions = function(state) {
      if (Math.floor(Math.random() * this._EXTENSION_CHANCE * (1 / state.timeScale)) === 0) this._createExtension(state);
    }

    _scope._updateEnvironment = function(state) {
      if (this._level && Math.floor(Math.random() * this._LEVEL_ELEMENT_CHANCE * (1 / state.timeScale)) === 0)
        this._createLevelElement(state);
    }

    _scope._playGame = function(state, levelId) {
      removeClass(this._container, "blur");

      this._setupLevel(state, levelId);
    }

    _scope._showMenuBackground = function(state) {
      addClass(this._container, "blur");
      this._playerCreateRequested = true;

      this._setupLevel(state, "menu");
    }

    _scope._setupLevel = function(state, levelId) {
      this._level = this._LEVELS[levelId];

      this._renderer.backgroundColor      = this._level.BACKGROUND_COLOR;
      this._renderer.backgroundFieldColor = this._level.FIELD_COLOR;
      state.timeScale                     = this._level.TIME_SCALE;
    }

    _scope._createPlayer = function(state) {
      state.control.latestShot = state.time;
      state.status.rockets     = this._MAX_ROCKETS;
      state.status.kills       = 0;

      this._player = this._getElement(SF.Player);
      this._player.reset(state);

      this._renderer.stage.addChild(this._player.pixiEl);
    }

    _scope._createRocket = function(state) {
      state.control.latestShot = state.time;
      state.status.rockets--;

      var rocket = this._getElement(SF.Rocket);

      rocket.reset(state, this._player.pixiEl.x, this._player.pixiEl.y);

      this._renderer.stage.addChild(rocket.pixiEl);
    }

    _scope._createEnemy = function(state) {
      state.latestEnemyTime = state.time;

      var enemy = Math.floor(Math.random() * this._ENEMY_METEOR_CHANCE) === 0
        ? this._getElement(SF.EnemyMeteor)
        : this._getElement(SF.EnemyShip);

      enemy.reset(state);

      this._renderer.stage.addChild(enemy.pixiEl);
    }

    _scope._createExplosion = function(state, x, y) {
      var explosion = this._getElement(SF.Explosion);

      explosion.reset(state, x, y);

      this._renderer.stage.addChild(explosion.pixiEl);
    }

    _scope._createLevelElement = function(state) {
      var levelElement = this._getElement(SF.LevelElement);

      this._level.setupElement(state, levelElement);

      this._renderer.backgroundStage.addChild(levelElement.pixiEl);
      this._renderer.backgroundStage.sortChildren();
    }

    _scope._createExtension = function(state) {
      var extension = this._getElement(SF.Ammo);

      extension.reset(state);

      this._renderer.stage.addChild(extension.pixiEl);
    }

    _scope._createExplosionFor = function(state, boundsA, boundsB) {
      var twoRectsCenter = getTwoRectsCenter(boundsA, boundsB);
      this._createExplosion(state, twoRectsCenter.x, twoRectsCenter.y);
    }

    _scope._updateElements = function(state, elements) {
      var element;
      var elementOwner;
      for (var i = 0, l = elements.length; i < l; ++i) {
        element = elements[i];
        elementOwner = element.owner;

        if (elementOwner.removable) {
          elementOwner.removeFromStage();

          this._recycler.add(elementOwner);

          --i;
          --l;
        } else elementOwner.update(state);
      }
    }

    _scope._collisionDetected = function(state, elementA, elementB, boundsA, boundsB) {
      if (
        this._checkTypes(
          elementA, elementB,
          SF.AbstractCollidable.Type.Enemy, SF.AbstractCollidable.Type.Player
        )
      ) {
        elementA.destroy();
        elementB.destroy();

        this._createExplosionFor(state, boundsA, boundsB);

        return true;
      } else if (
        this._checkTypes(
          elementA, elementB,
          SF.AbstractCollidable.Type.Enemy, SF.AbstractCollidable.Type.Rocket
        )
      ) {
        elementA.destroy();
        elementB.destroy();

        this._createExplosionFor(state, boundsA, boundsB);

        state.status.kills++;
      } else if (
        this._checkTypes(
          elementA, elementB,
          SF.AbstractCollidable.Type.Extension, SF.AbstractCollidable.Type.Player
        )
      ) {
        var extension = elementA.type === SF.AbstractCollidable.Type.Extension
          ? elementA
          : elementB;

        if (is(extension, SF.Ammo)) {
          state.status.rockets = Math.min(this._MAX_ROCKETS, state.status.rockets + extension.VALUE);
          extension.destroy();
        }
      }

      return false;
    }

    _scope._detectCollisions = function(state) {
      if (state.view === "game")
        SF.DetectCollisions(state, this._renderer.stage.children, this._collisionDetectedBound);
    }

    _scope._checkTypes = function(elementA, elementB, typeA, typeB) {
      return (elementA.type === typeA && elementB.type === typeB) ||
             (elementB.type === typeA && elementA.type === typeB);
    }

    _scope._updateRenderer = function(state) {
      this._renderer.update(state);
    }

    _scope._getElement = function(type) {
      return this._recycler.get(type) || new type(this._baseTexture);
    }

    _scope._gameOver = function(state) {
      state.view = "menu";

      state.player.targetPosition.x = this._PLAYER_DEFAULT_POSITION.x;
      state.player.targetPosition.y = this._PLAYER_DEFAULT_POSITION.y;
    }

    _scope._onDOChange = function(state, prevState) {
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

    _scope._onClick = function() {
      this._rocketLaunchRequested = true;
    }
  }
);
