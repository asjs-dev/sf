import {between, rgbToInt} from "../utility/utils.js";
import Config from "../Config.js";
import AbstractLevel from "./AbstractLevel.js";

export default class LevelMenuBackground extends AbstractLevel {
  constructor() {
    super();

    this.BACKGROUND_COLOR = 0x000033;
    this.FIELD_COLOR      = 0x1327B1;
    this.TIME_SCALE       = 0.25;
  }

  setupElement(state, element) {
    const sizeConfig = Config.size;

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
