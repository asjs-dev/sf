SF.AbstractBreakable = createClass(
  SF.AbstractCollidable,
  function AbstractBreakable(baseTexture) {
    SF.AbstractCollidable.call(this, baseTexture);

    this._BREAKING_SPEED = SF.Config.breakingSpeed;
  },
  function(_scope, _super) {
    _scope.reset = function(state) {
      _super.reset.call(this);

      this._isBreakingApart = false;
    }

    _scope.update = function(state) {
      this._isBreakingApart && this._updateBreaking(state);
    }

    _scope.breakApart = function() {
      this._isBreakingApart = true;
    }

    _scope._resetItem = function(item) {
      item.rotation = 0;
      item.alpha    = 1;
      item.position.set(0);
    }

    _scope._updateBreaking = function(state) {}

    _scope._updateItemBreaking = function(state, item) {
      var timeScale = state.timeScale;

      item.rotation += 0.01 * timeScale;
      item.alpha    -= 0.01 * timeScale;

      var speed = this._BREAKING_SPEED * timeScale;
      item.x += Math.sin(item.rotation) * speed;
      item.y += Math.cos(item.rotation) * speed;
    }
  }
);
