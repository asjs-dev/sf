SF.Explosion = createClass(
  SF.AbstractRenderable,
  function Explosion(baseTexture) {
    SF.AbstractRenderable.call(this, baseTexture, PIXI.ParticleContainer);

    this._SPEED         = SF.Config.speed;
    this._MAX_PARTICLES = 10;
    this._COLORS        = {
      from : {
        r : 255,
        g : 64,
        b : 32
      },
      to : {
        r : 105,
        g : 105,
        b : 105
      }
    };

    this._container.setProperties({
      rotation : true,
      scale    : true,
      tint     : true
    });
    this._container.scale.set(0.5);

    var texture = SF.TextureAtlas.getTexture(this._baseTexture, "Explosion");
    for (var i = 0, l = this._MAX_PARTICLES; i < l; ++i)
      this._container.addChild(new PIXI.Sprite(texture));
  },
  function(_scope, _super) {
    _scope.reset = function(state, x, y) {
      _super.reset.call(this);

      this._container.alpha = 1;
      this._container.x     = x;
      this._container.y     = y;

      var explosionConfig = SF.Config.explosion;

      var particle;

      for (var i = 0, l = this._container.children.length; i < l; ++i) {
        particle                 = this._container.children[i];
        particle.rotation        = Math.random() * 360;
        particle._ROTATION_SPEED = (Math.random() - 0.5) * 0.05;
        particle._SPEED          = between(
          explosionConfig.minSpeed,
          explosionConfig.maxSpeed,
          Math.random() * explosionConfig.maxSpeed
        );
        particle._step = 0;
        particle.scale.set(Math.random() * 0.25);

        particle.position.set(0);
        particle.alpha = 1;
      }
    }

    _scope.update = function(state) {
      var timeScale = state.timeScale;

      var particle;
      var speed;

      for (var i = 0, l = this._container.children.length; i < l; ++i) {
        particle = this._container.children[i];
        particle.scale.set(particle.scale.x + 0.05 * timeScale);
        particle.rotation += particle._ROTATION_SPEED * timeScale;

        speed = particle._SPEED * timeScale;
        particle.x += Math.sin(particle.rotation) * speed;
        particle.y += Math.cos(particle.rotation) * speed;

        particle._step += (0.005 + particle._SPEED * 0.001) * timeScale;
        var easeStep = easeInOut(particle._step);
        particle.tint = getAnimatedColor(this._COLORS.from, this._COLORS.to, easeStep);
      }

      this._container.alpha -= Math.random() * 0.01 * timeScale;
      this._container.x     -= this._SPEED * timeScale;

      if (this._container.alpha < 0) this.removable = true;
    }

    _scope._customDestruct = function() {
      this._container.removeChild(this._body);
    }
  }
);
