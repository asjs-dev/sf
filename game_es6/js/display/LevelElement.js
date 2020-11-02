SF.LevelElement = class LevelElement extends SF.AbstractRenderable {
  constructor(baseTexture) {
    super(baseTexture, PIXI.Sprite);

    this._SPEED = SF.Config.level.element.speed;

    this._colorMatrix = new PIXI.filters.ColorMatrixFilter();
    this._container.filters = [this._colorMatrix];
  }

  reset(state, textureId, px, py, sx, sy, y, z, tint, alpha, speedMultiply) {
    super.reset();

    this.zIndex = z;

    this._container.texture = SF.TextureAtlas.getTexture(this._baseTexture, textureId);

    const sizeConfig = SF.Config.size;

    this._container.zIndex = this.zIndex;
    this._container.width  = this._container.texture.frame.width;
    this._container.height = this._container.texture.frame.height;

    this._container.anchor.set(px, py);
    this._container.scale.set(sx, sy);

    this._leftBorder = -this._container.width;

    this._container.x = sizeConfig.width + this._container.width;
    this._speed = this._SPEED * speedMultiply * (0.25 + this.zIndex * 0.75);

    this._container.y = y;

    this._container.tint  = tint;
    this._container.alpha = between(0, 1, alpha);
  }

  update(state) {
    this._container.x -= this._speed * state.timeScale;

    if (this._container.x < this._leftBorder) this.removable = true;
  }
};
