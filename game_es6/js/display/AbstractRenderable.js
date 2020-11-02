SF.AbstractRenderable = class AbstractRenderable extends SF.BaseClass {
  constructor(baseTexture, containerType) {
    super();

    this._baseTexture = baseTexture;

    this._container = new (containerType || PIXI.Container)();
    this._container.owner = this;
  }

  get pixiEl() {
    return this._container;
  }

  reset() {
    this.removable = false;
  }

  destruct() {
    this._customDestruct();
    this._container.parent && this._container.parent.removeChild(this._container);
  }

  removeFromStage() {
    this.pixiEl.parent && this.pixiEl.parent.removeChild(this.pixiEl);
  }

  _customDestruct() {}
};
