SF.LevelPlanet = class LevelPlanet extends SF.AbstractLevel {
  constructor() {
    super();

    this.BACKGROUND_COLOR = 0x28A2DA;
    this.FIELD_COLOR      = 0x6FC033;
    this.TIME_SCALE       = SF.Config.defaultState.timeScale;

    this._textureRects = [
      "Walker",
      "TreeA",
      "TreeB",
      "TreeC",
      "Cloud"
    ];
  }

  setupElement(state, element) {
    const sizeConfig = SF.Config.size;

    const z      = Math.random();
    const zScale = z * 3;

    if (Math.floor(Math.random() * 500) === 0) {
      element.reset(
        state,
        this._textureRects[0],
        0.5, 1,
        zScale, zScale,
        sizeConfig.height * (0.55 + z * 0.5),
        z,
        0xFFFFFF,
        z * 2,
        0.5
      );
    } else {
      switch (Math.floor(Math.random() * 4)) {
        case 0:
          element.reset(
            state,
            this._textureRects[1],
            0.5, 1,
            between(0.75, 1, Math.random()) * zScale,
            between(0.75, 1, Math.random()) * zScale,
            sizeConfig.height * (0.55 + z * 0.5),
            z,
            rgbToInt(
              between(128, 255, Math.random() * 255),
              between(128, 255, Math.random() * 255),
              between(128, 255, Math.random() * 255)
            ),
            z * 2,
            0.5
          );
          break;
        case 1:
          element.reset(
            state,
            this._textureRects[2],
            0.5, 1,
            between(0.75, 1, Math.random()) * zScale,
            between(0.75, 1, Math.random()) * zScale,
            sizeConfig.height * (0.55 + z * 0.5),
            z,
            rgbToInt(
              between(128, 255, Math.random() * 255),
              between(128, 255, Math.random() * 255),
              between(128, 255, Math.random() * 255)
            ),
            z * 2,
            0.5
          );
          break;
        case 2:
          element.reset(
            state,
            this._textureRects[3],
            0.5, 1,
            between(0.75, 1, Math.random()) * zScale,
            between(0.75, 1, Math.random()) * zScale,
            sizeConfig.height * (0.55 + z * 0.5),
            z,
            rgbToInt(
              between(128, 255, Math.random() * 255),
              between(128, 255, Math.random() * 255),
              between(128, 255, Math.random() * 255)
            ),
            z * 2,
            0.5
          );
          break;
        case 3:
          element.reset(
            state,
            this._textureRects[4],
            0.5, 1,
            between(0.5, 2, Math.random() * 2),
            between(0.5, 1, Math.random()),
            sizeConfig.height * (1 - z) * 0.5,
            z,
            0xFFFFFF,
            z * 0.25,
            0.25
          );
          break;
      }
    }
  }
};
