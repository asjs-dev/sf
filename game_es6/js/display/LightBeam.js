SF.LightBeam = class LightBeam extends SF.AbstractBreakable {
  constructor(baseTexture, type) {
    super(baseTexture);

    this._lightBeamTextureFrames = type || SF.LightBeam.Type.Blue;
    this._lightBeamTexture = SF.TextureAtlas.getTexture(this._baseTexture, this._lightBeamTextureFrames[0]);
    this._lightBeam = new PIXI.Sprite(this._lightBeamTexture);
    this._container.addChild(this._lightBeam);
  }

  reset(state) {
    super.reset(state);

    this._resetItem(this._lightBeam);
  }

  update(state) {
    super.update(state);

    if (Math.floor(Math.random() * 5) === 0)
      this._lightBeamTexture.frame = SF.TextureAtlas.TextureRects[
        this._lightBeamTextureFrames[
          state.time % this._lightBeamTextureFrames.length
        ]
      ];
  }

  breakApart() {
    super.breakApart();

    this._lightBeam.rotation = Math.random() * 180;
  }

  _updateBreaking(state) {
    this._updateItemBreaking(state, this._lightBeam);
  }

  _customDestruct() {
    this._container.removeChild(this._lightBeam);
  }
};
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
