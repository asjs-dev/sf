SF.AbstractLevel = class AbstractLevel extends SF.BaseClass {
  constructor() {
    super();

    this.BACKGROUND_COLOR = 0x000000;
    this.FIELD_COLOR      = 0x000000;
    this.TIME_SCALE       = 1;
  }

  setupElement(state, element) {}
};
