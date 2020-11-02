SF.LevelSpace = class LevelSpace extends SF.AbstractLevel {
  constructor() {
    super();

    this.BACKGROUND_COLOR = 0x220022;
    this.FIELD_COLOR      = 0x000033;
    this.TIME_SCALE       = 1;

    this._textureRects = [
      "StarLine",
      "PlanetA",
      "PlanetB",
      "PlanetC",
      "PlanetD"
    ];
  }

  setupElement(state, element) {
    const sizeConfig = SF.Config.size;

    let z = Math.random();

    let textureRect;
    let alpha;
    let scaleX;
    let scaleY;
    let tint;

    if (Math.floor(Math.random() * 50) === 0) {
      textureRect = this._textureRects[1 + Math.floor(Math.random() * 4)];

      scaleX =
      scaleY = between(0.1, 10, Math.random());

      tint  = 0xFFFFFF * z;
      alpha = 1;

      z = z * 0.25;
    } else {
      textureRect = this._textureRects[0];

      scaleX = between(0.5, 2, Math.random());
      scaleY = between(0.5, 2, Math.random());

      tint  = 0xFFFFFF;
      alpha = z * 0.25;
    }

    element.reset(
      state,
      textureRect,
      0.5, 0.5,
      scaleX,
      scaleY,
      sizeConfig.height * Math.random(),
      z,
      0xFFFFFF,
      alpha,
      4
    );
  }
};
