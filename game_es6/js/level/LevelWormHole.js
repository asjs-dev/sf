SF.LevelWormHole = class LevelWormHole extends SF.AbstractLevel {
  constructor() {
    super();

    this.BACKGROUND_COLOR = 0x111111;
    this.FIELD_COLOR      = 0x334455;
    this.TIME_SCALE       = 0.5;
  }

  setupElement(state, element) {
    const sizeConfig = SF.Config.size;

    const z = Math.random();

    element.reset(
      state,
      "Cloud",
      0.5, 0.5,
      between(0.5, 2, Math.random()),
      between(0.5, 2, Math.random()),
      sizeConfig.height * Math.random(),
      z,
      rgbToInt(
        Math.random() * 255,
        Math.random() * 255,
        Math.random() * 255
      ),
      z * 0.5,
      1
    );
  }
};
