var DataObserver = function(defaultState) {
  var _scope = {};

  var _addHandlers    = [];
  var _removeHandlers = [];

  var _handlers  = {};
  var _prevState = {};
  var _state     = defaultState !== undefined ? defaultState : {};

  (function() {
    (function render() {
      updateHandlers();

      if (!DataObserver.eq(_state, _prevState)) {
        var stateClone     = DataObserver.clone(_state);
        var prevStateClone = deepFreeze(DataObserver.clone(_prevState));

        dispatchToHandlers(stateClone, prevStateClone);

        _prevState = stateClone;
      }

      requestAnimationFrame(render);
    })();
  })();

  _scope.getState = function() {
    return DataObserver.clone(_state);
  }

  _scope.setState = function(data) {
    _state = DataObserver.clone(data);
  }

  _scope.on = function(dataPath, handler) {
    if (typeof dataPath !== "string") {
      handler  = dataPath;
      dataPath = "";
    }

    _addHandlers.push({
      dataPath : dataPath,
      handler  : handler
    });
  }

  _scope.off = function(dataPath, handler) {
    _removeHandlers.push({
      dataPath : dataPath,
      handler  : handler
    });
  }

  _scope.has = function(dataPath, handler) {
    return getHandlerIndex(dataPath, handler) > -1;
  }

  function getHandlerIndex(dataPath, handler) {
    return getIndexFrom(_handlers, dataPath, handler);
  }

  function getIndexFrom(object, dataPath, item) {
    return object[dataPath]
      ? object[dataPath].indexOf(item)
      : -1;
  }

  function dispatchToHandlers(state, prevState) {
    for (var key in _handlers) {
      var stateObjectByPath     = getObjectByPath(state, key);
      var prevStateObjectByPath = getObjectByPath(prevState, key);

      if (!DataObserver.eq(stateObjectByPath, prevStateObjectByPath))
        for (var i = 0, l = _handlers[key].length; i < l; ++i)
          _handlers[key][i](stateObjectByPath, prevStateObjectByPath);
    }
  }

  function getObjectByPath(object, dataPath) {
    var dataPathSequence = dataPath ? dataPath.split(".") : [];
    var obj = object;

    for (var i = 0, l = dataPathSequence.length; i < l; ++i) {
      if (obj[dataPathSequence[i]] === undefined)
        return null;

      obj = obj[dataPathSequence[i]];
    }

    return obj !== undefined ? obj : null;
  }

  function setObjectByPath(object, dataPath, data) {
    if (!dataPath || dataPath === "")
      return data;

    var dataPathSequence = dataPath ? dataPath.split(".") : [];
    var obj = object;

    for (var i = 0, l = dataPathSequence.length; i < l; ++i) {
      var key = dataPathSequence[i];

      if (obj[key] === undefined || obj[key] === null)
        return null;

      if (i === l - 1)
        obj[key] = data;
      else
        obj = obj[key];
    }

    return object;
  }

  function addHandler(dataPath, handler) {
    if (!_scope.has(dataPath, handler)) {
      _handlers[dataPath] = _handlers[dataPath] || [];
      _handlers[dataPath].push(handler);
      handler(getObjectByPath(_state, dataPath), getObjectByPath(_prevState, dataPath));
    }
  }

  function removeHandler(dataPath, handler) {
    _scope.has(dataPath, handler) && _handlers[dataPath].splice(getHandlerIndex(dataPath, handler), 1);
  }

  function updateHandlers() {
    var handlerData;

    while (handlerData = _addHandlers.shift())
      addHandler(handlerData.dataPath, handlerData.handler);

    while (handlerData = _removeHandlers.shift())
      removeHandler(handlerData.dataPath, handlerData.handler);
  }

  return _scope;
}
DataObserver.clone = function(a) {
  if (typeof a !== "object" || a === null || a === undefined)
    return a;

  var b = Array.isArray(a)
    ? []
    : {};

  var propNames = Object.getOwnPropertyNames(a);

  var key;
  var i = propNames.length;
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

  var ap = Object.getOwnPropertyNames(a);
  var bp = Object.getOwnPropertyNames(b);

  if (ap.length !== bp.length)
    return false;

  var pn, av, bv, subeq;
  var i = ap.length;
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

  var ap = Object.getOwnPropertyNames(a);
  var bp = Object.getOwnPropertyNames(b);

  var i = -1;
  var l = bp.length;
  while (++i < l) {
    pn = bp[i];
    av = a[pn];
    bv = b[pn];

    if (av === null || av === undefined)
      a[pn] = bv;
  }
}
