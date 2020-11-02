import AbstractViewController from "./AbstractViewController.js";

export default class SplashViewController extends AbstractViewController {
  constructor(dataObserver) {
    super(dataObserver);

    this._container = document.querySelector(".splash-screen");

    this._dataObserver.on("view", this._onDOViewChange.bind(this));

    setTimeout(this._hideSplashScreen.bind(this), 2000);
  }

  _hideSplashScreen() {
    let state = this._dataObserver.getState();
        state.view = "menu";
    this._dataObserver.setState(state);
  }

  _onDOViewChange(state, prevState) {
    state === "splash"
      ? this._show()
      : this._hide();
  }
};
