SF.SplashViewController = createClass(
  SF.AbstractViewController,
  function SplashViewController(dataObserver) {
    SF.AbstractViewController.call(this, dataObserver);

    this._container = document.querySelector(".splash-screen");

    this._dataObserver.on("view", this._onDOViewChange.bind(this));

    setTimeout(this._hideSplashScreen.bind(this), 2000);
  },
  function(_scope) {
    _scope._hideSplashScreen = function() {
      var state = this._dataObserver.getState();
          state.view = "menu";
      this._dataObserver.setState(state);
    }

    _scope._onDOViewChange = function(state, prevState) {
      state === "splash"
        ? this._show()
        : this._hide();
    }
  }
);
