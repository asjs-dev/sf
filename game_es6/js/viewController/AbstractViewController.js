SF.AbstractViewController = class AbstractViewController extends SF.BaseClass {
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
