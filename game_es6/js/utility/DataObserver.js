import {deepFreeze} from "./utils.js";

export default class DataObserver {
  constructor(defaultState) {
    this._addHandlers    = [];
    this._removeHandlers = [];

    this._handlers  = {};
    this._prevState = {};
    this._state     = defaultState !== undefined ? defaultState : {};

    this._renderBound = this._render.bind(this);

    this._render();
  }

  _render() {
    this._updateHandlers();

    if (!DataObserver.eq(this._state, this._prevState)) {
      let stateClone       = DataObserver.clone(this._state);
      const prevStateClone = deepFreeze(DataObserver.clone(this._prevState));

      this._dispatchToHandlers(stateClone, prevStateClone);

      this._prevState = stateClone;
    }

    requestAnimationFrame(this._renderBound);
  }

  getState() {
    return DataObserver.clone(this._state);
  }

  setState(data) {
    this._state = DataObserver.clone(data);
  }

  on(dataPath, handler) {
    if (typeof dataPath !== "string") {
      handler  = dataPath;
      dataPath = "";
    }

    this._addHandlers.push({
      dataPath : dataPath,
      handler  : handler
    });
  }

  off(dataPath, handler) {
    this._removeHandlers.push({
      dataPath : dataPath,
      handler  : handler
    });
  }

  has(dataPath, handler) {
    return this._getHandlerIndex(dataPath, handler) > -1;
  }

  _getHandlerIndex(dataPath, handler) {
    return this._getIndexFrom(this._handlers, dataPath, handler);
  }

  _getIndexFrom(object, dataPath, item) {
    return object[dataPath]
      ? object[dataPath].indexOf(item)
      : -1;
  }

  _dispatchToHandlers(state, prevState) {
    for (let key in this._handlers) {
      let stateObjectByPath       = this._getObjectByPath(state, key);
      const prevStateObjectByPath = this._getObjectByPath(prevState, key);

      if (!DataObserver.eq(stateObjectByPath, prevStateObjectByPath))
        for (let i = 0, l = this._handlers[key].length; i < l; ++i)
          this._handlers[key][i](stateObjectByPath, prevStateObjectByPath);
    }
  }

  _getObjectByPath(object, dataPath) {
    const dataPathSequence = dataPath ? dataPath.split(".") : [];
    let obj = object;

    for (let i = 0, l = dataPathSequence.length; i < l; ++i) {
      if (obj[dataPathSequence[i]] === undefined)
        return null;

      obj = obj[dataPathSequence[i]];
    }

    return obj !== undefined ? obj : null;
  }

  _setObjectByPath(object, dataPath, data) {
    if (!dataPath || dataPath === "")
      return data;

    const dataPathSequence = dataPath ? dataPath.split(".") : [];
    let obj = object;

    for (let i = 0, l = dataPathSequence.length; i < l; ++i) {
      let key = dataPathSequence[i];

      if (obj[key] === undefined || obj[key] === null)
        return null;

      if (i === l - 1)
        obj[key] = data;
      else
        obj = obj[key];
    }

    return object;
  }

  _addHandler(dataPath, handler) {
    if (!this.has(dataPath, handler)) {
      this._handlers[dataPath] = this._handlers[dataPath] || [];
      this._handlers[dataPath].push(handler);
      handler(this._getObjectByPath(this._state, dataPath), this._getObjectByPath(this._prevState, dataPath));
    }
  }

  _removeHandler(dataPath, handler) {
    this.has(dataPath, handler) && this._handlers[dataPath].splice(this._getHandlerIndex(dataPath, handler), 1);
  }

  _updateHandlers() {
    let handlerData;

    while (handlerData = this._addHandlers.shift())
      this._addHandler(handlerData.dataPath, handlerData.handler);

    while (handlerData = this._removeHandlers.shift())
      this._removeHandler(handlerData.dataPath, handlerData.handler);
  }
};

DataObserver.clone = function(a) {
  if (typeof a !== "object" || a === null || a === undefined)
    return a;

  let b = Array.isArray(a)
    ? []
    : {};

  const propNames = Object.getOwnPropertyNames(a);

  let key;
  let i = propNames.length;
  while (key = propNames[--i])
    b[key] = typeof a[key] === "object"
      ? DataObserver.clone(a[key])
      : a[key];

  return b;
};

DataObserver.eq = function(a, b) {
  if (a === null || b === null)
    return a === b;

  if (typeof a !== typeof b)
    return false;

  if (typeof a !== "object")
    return a === b;

  const ap = Object.getOwnPropertyNames(a);
  const bp = Object.getOwnPropertyNames(b);

  if (ap.length !== bp.length)
    return false;

  let pn, av, bv, subeq;
  let i = ap.length;
  while (pn = ap[--i]) {
    av = a[pn];
    bv = b[pn];

    if (av !== bv) {
      subeq = false;

      if (typeof av === "object" && typeof bv === "object")
        subeq = DataObserver.eq(av, bv);

      if (!subeq)
        return false;
    }
  }
  return true;
};

DataObserver.merge = function(a, b) {
  if (a === null || b === null)
    return;

  const ap = Object.getOwnPropertyNames(a);
  const bp = Object.getOwnPropertyNames(b);

  const i = -1;
  const l = bp.length;
  while (++i < l) {
    pn = bp[i];
    av = a[pn];
    bv = b[pn];

    if (av === null || av === undefined)
      a[pn] = bv;
  }
}
