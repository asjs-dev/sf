SF.LightBeam = createClass(
  SF.AbstractBreakable,
  function LightBeam(baseTexture, type) {
    SF.AbstractBreakable.call(this, baseTexture);

    this._lightBeamTextureFrames = type || SF.LightBeam.Type.Blue;
    this._lightBeamTexture = SF.TextureAtlas.getTexture(this._baseTexture, this._lightBeamTextureFrames[0]);
    this._lightBeam = new PIXI.Sprite(this._lightBeamTexture);
    this._container.addChild(this._lightBeam);
  },
  function(_scope, _super) {
    _scope.reset = function(state) {
      _super.reset.call(this, state);

      this._resetItem(this._lightBeam);
    }

    _scope.update = function(state) {
      _super.update.call(this, state);

      if (Math.floor(Math.random() * 5) === 0)
        this._lightBeamTexture.frame = SF.TextureAtlas.TextureRects[
          this._lightBeamTextureFrames[
            state.time % this._lightBeamTextureFrames.length
          ]
        ];
    }

    _scope.breakApart = function() {
      _super.breakApart.call(this);

      this._lightBeam.rotation = Math.random() * 180;
    }

    _scope._updateBreaking = function(state) {
      this._updateItemBreaking(state, this._lightBeam);
    }

    _scope._customDestruct = function() {
      this._container.removeChild(this._lightBeam);
    }
  }
);
SF.LightBeam.Type = {
  Blue: [
    "LightBeamBlueA",
    "LightBeamBlueB"
  ],
  Red: [
    "LightBeamRedA",
    "LightBeamRedB"
  ]
}
