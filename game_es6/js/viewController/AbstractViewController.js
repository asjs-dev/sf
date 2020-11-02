import {addClass, removeClass} from "../utility/utils.js";
import BaseClass from "../helper/BaseClass.js";

export default class AbstractViewController extends BaseClass {
  constructor(dataObserver) {
    super();

    this._dataObserver = dataObserver;
    this._container;
  }

  _show() {
    removeClass(this._container, "hide");
  }

  _hide() {
    addClass(this._container, "hide");
  }
};
