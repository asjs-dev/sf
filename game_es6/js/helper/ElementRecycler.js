import {is} from "../utility/utils.js";

export default class ElementRecycler {
  constructor() {
    this._list = [];
  }

  add(rect, element) {
    this._list.push(element);
  }

  get(type) {
    let element;
    for (let i = 0, l = this._list.length; i < l; ++i) {
      element = this._list[i];
      if (is(element, type)) {
        this._list.splice(i, 1);
        return element;
      }
    }

    return null;
  }
};
