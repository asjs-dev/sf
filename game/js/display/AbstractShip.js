SF.AbstractShip = createClass(
  SF.AbstractBreakable,
  function AbstractShip(baseTexture, lightBeamType) {
    SF.AbstractBreakable.call(this, baseTexture);

    this._cabin = new PIXI.Sprite();
    this._container.addChild(this._cabin);

    this._body = new PIXI.Sprite();
    this._container.addChild(this._body);

    this._engine = new PIXI.Sprite();
    this._container.addChild(this._engine);

    this._wing = new PIXI.Sprite();
    this._container.addChild(this._wing);

    this._lightBeam = new SF.LightBeam(
      this._baseTexture,
      lightBeamType
    );
    this._container.addChild(this._lightBeam.pixiEl);

    this._gun = new PIXI.Sprite();
    this._container.addChild(this._gun);
  },
  function(_scope, _super) {
    _scope.reset = function(state) {
      _super.reset.call(this, state);

      this._resetItem(this._cabin);
      this._resetItem(this._body);
      this._resetItem(this._engine);
      this._resetItem(this._wing);
      this._resetItem(this._gun);

      this._lightBeam.reset(state);
    }

    _scope.update = function(state) {
      _super.update.call(this, state);

      this._customUpdate(state);
      this._lightBeam.update(state);
    }

    _scope.destroy = function() {
      this.isAbleToCollide = false;
      this.breakApart();
    }

    _scope.breakApart = function() {
      _super.breakApart.call(this);

      this._cabin.rotation  = Math.random() * 180;
      this._body.rotation   = Math.random() * 180;
      this._engine.rotation = Math.random() * 180;
      this._wing.rotation   = Math.random() * 180;
      this._gun.rotation    = Math.random() * 180;

      this._lightBeam.breakApart();
    }

    _scope._updateBreaking = function(state) {
      this._updateItemBreaking(state, this._cabin);
      this._updateItemBreaking(state, this._body);
      this._updateItemBreaking(state, this._engine);
      this._updateItemBreaking(state, this._wing);
      this._updateItemBreaking(state, this._gun);

      if (this._body.alpha < 0) this.removable = true;
    }

    _scope._customDestruct = function() {
      this._container.removeChild(this._body);
      this._container.removeChild(this._lightBeam.pixiEl);
      this._container.removeChild(this._cabin);
      this._container.removeChild(this._engine);
      this._container.removeChild(this._wing);
      this._container.removeChild(this._gun);

      this._lightBeam.destruct();
    }

    this._customUpdate = function(state) {}
  }
);
