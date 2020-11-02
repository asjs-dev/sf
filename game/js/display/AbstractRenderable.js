SF.AbstractRenderable = createClass(
  SF.BaseClass,
  function AbstractRenderable(baseTexture, containerType) {
    SF.BaseClass.call(this);

    this._baseTexture = baseTexture;

    this._container = new (containerType || PIXI.Container)();
    this._container.owner = this;
  },
  function(_scope) {
    get(_scope, "pixiEl", function() { return this._container; });

    _scope.reset = function() {
      this.removable = false;
    }

    _scope.destruct = function() {
      this._customDestruct();
      this._container.parent && this._container.parent.removeChild(this._container);
    }

    _scope.removeFromStage = function() {
      this.pixiEl.parent && this.pixiEl.parent.removeChild(this.pixiEl);
    }

    _scope._customDestruct = function() {}
  }
);
