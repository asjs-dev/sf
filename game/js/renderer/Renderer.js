SF.Renderer = createClass(
  SF.BaseClass,
  function Renderer(baseTexture, options) {
    SF.BaseClass.call(this);

    this._renderer = PIXI.autoDetectRenderer(options);

    this._backgroundColor = new SF.ColorizedBackground(
      baseTexture,
      "Sky",
      this._renderer.width,
      this._renderer.height
    );

    this._backgroundFieldColor = new SF.ColorizedBackground(
      baseTexture,
      "Field",
      this._renderer.width,
      this._renderer.height
    );

    this.backgroundStage = new PIXI.ParticleContainer(1000, {
      vertices : true,
      tint     : true
    });

    this.stage = new PIXI.Container();

    this._container = new PIXI.Container();

    this._interactiveLayers = new PIXI.Container();

    this._container.addChild(this._backgroundColor.pixiEl);
    this._container.addChild(this._backgroundFieldColor.pixiEl);
    this._container.addChild(this._interactiveLayers);
    this._interactiveLayers.addChild(this.backgroundStage);
    this._interactiveLayers.addChild(this.stage);

    this._renderTextureA = PIXI.RenderTexture.create(options);
    this._renderTextureB = PIXI.RenderTexture.create(options);

    this._rtSprite = new PIXI.Sprite(this._renderTextureA);
    this._rtSprite.position.x = this._renderer.width * 0.5;
    this._rtSprite.position.y = this._renderer.height * 0.5;
    this._rtSprite.anchor.set(0.5);
    this._interactiveLayers.addChild(this._rtSprite);

    this.backgroundColor = 0x000000;
  },
  function(_scope) {
    property(_scope, "backgroundColor", {
      get: function() { return this._backgroundColor.color; },
      set: function(v) { this._backgroundColor.color = v; }
    });

    property(_scope, "backgroundFieldColor", {
      get: function() { return this._backgroundFieldColor.color; },
      set: function(v) { this._backgroundFieldColor.color = v; }
    });

    get(_scope, "view", function() {
      return this._renderer.view;
    });

    _scope.update = function(state) {
      var timeScale = state.timeScale;

      this._backgroundColor.update(timeScale);
      this._backgroundFieldColor.update(timeScale);

      var temp = this._renderTextureA;
      this._renderTextureA = this._renderTextureB;
      this._renderTextureB = temp;

      this._rtSprite.texture = this._renderTextureA;

      this._rtSprite.alpha = 0.9;
      this._rtSprite.x    -= 1;
      this._rtSprite.tint  = 0xFFFFFF;
      this._renderer.render(this._interactiveLayers, this._renderTextureB);

      this._rtSprite.alpha = 0.5;
      this._rtSprite.x += 1;
      this._rtSprite.scale.set(1 + (1 - timeScale) * 0.025);
      this._rtSprite.tint  = 0xAAAAAA;
      this._renderer.render(this._container);
    }
  }
);
