SF.AbstractViewController = createClass(
  SF.BaseClass,
  function AbstractViewController(dataObserver) {
    SF.BaseClass.call(this);

    this._dataObserver = dataObserver;
    this._container;
  },
  function(_scope) {
    _scope._show = function() {
      removeClass(this._container, "hide");
    }

    _scope._hide = function() {
      addClass(this._container, "hide");
    }
  }
);
