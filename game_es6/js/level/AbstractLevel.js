import BaseClass from "../helper/BaseClass.js";

export default class AbstractLevel extends BaseClass {
  constructor() {
    super();

    this.BACKGROUND_COLOR = 0x000000;
    this.FIELD_COLOR      = 0x000000;
    this.TIME_SCALE       = 1;
  }

  setupElement(state, element) {}
};
