SF.ColorizedBackground = createClass(
  SF.AbstractRenderable,
  function ColorizedBackground(baseTexture, id, width, height) {
    SF.AbstractRenderable.call(this, baseTexture);

    this._SPEED     = SF.Config.bgColorChangingSpeed;
    this._MAX_STEPS = 1 + this._SPEED;

    this._item        = new PIXI.Sprite(SF.TextureAtlas.getTexture(this._baseTexture, id));
    this._item.width  = width;
    this._item.height = height;
    this._container.addChild(this._item);

    this._step = 1;
    this._latestColor = {
      r : 0,
      g : 0,
      b : 0
    };
    this._targetColor = {
      r : 0,
      g : 0,
      b : 0
    };
  },
  function(_scope) {
    property(_scope, "color", {
      get: function() { return this._item.tint; },
      set: function(v) {
        var targetColor = intToRgb(v);
        if (this._targetColor !== targetColor) {
          this._targetColor = targetColor;
          this._latestColor = intToRgb(this._item.tint);
          this._step = 0;
        }
      }
    });

    _scope.update = function(timeScale) {
      this._step += this._SPEED * timeScale;
      if (this._step < this._MAX_STEPS)
        this._item.tint = getAnimatedColor(this._latestColor, this._targetColor, easeInOut(this._step));
    }
  }
);
