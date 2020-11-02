import {addClass, removeClass} from "../utility/utils.js";
import Config from "../Config.js";
import AbstractViewController from "./AbstractViewController.js";

export default class MenuViewController extends AbstractViewController {
  constructor(dataObserver) {
    super(dataObserver);

    this._container = document.querySelector(".menu-screen");

    this._preview = this._container.querySelector(".preview");

    this._buttonClickBound = this._onMenuButtonClick.bind(this);
    this._onExitClickBound = this._onExitClick.bind(this);

    this._gameButtons = this._container.querySelector(".game-buttons");
    this._gameButtons.addEventListener("mouseover", this._onMenuButtonMouseOver.bind(this));
    this._gameButtons.addEventListener("mouseout",  this._onMenuButtonMouseOut.bind(this));

    this._exitButton = this._container.querySelector(".button.exit");

    this._dataObserver.on("view",    this._onDOViewChange.bind(this));
    this._dataObserver.on("preview", this._onDOPreviewChange.bind(this));
  }

  _show() {
    super._show();

    this._gameButtons.addEventListener("click", this._buttonClickBound);
    this._exitButton.addEventListener("click",  this._onExitClickBound);
  }

  _hide() {
    super._hide();

    this._gameButtons.removeEventListener("click", this._buttonClickBound);
    this._exitButton.removeEventListener("click",  this._onExitClickBound);
  }

  _showPreview(preview) {
    addClass(this._preview, "show");
    this._preview.style.backgroundImage = "url(img/game-preview/" + preview + ")";
  }

  _hidePreview() {
    removeClass(this._preview, "show");
  }

  _exit() {
    window.top.location.href = Config.landingPage;
  }

  _onDOViewChange(state, prevState) {
    switch (state) {
      case "menu": this._show();
        break;
      case "exit": this._exit();
        break;
      default:     this._hide();
        break;
    }
  }

  _onDOPreviewChange(state, prevState) {
    state
      ? this._showPreview(state)
      : this._hidePreview();
  }

  _onExitClick() {
    let state = this._dataObserver.getState();
        state.view = "exit";

    this._dataObserver.setState(state);
  }

  _onMenuButtonClick(event) {
    let state         = this._dataObserver.getState();
        state.view    = "game";
        state.levelId = event.target.dataset["levelId"];

    this._dataObserver.setState(state);
  }

  _onMenuButtonMouseOver(event) {
    let state         = this._dataObserver.getState();
        state.preview = event.target.dataset["levelPreview"];

    this._dataObserver.setState(state);
  }

  _onMenuButtonMouseOut(event) {
    let state         = this._dataObserver.getState();
        state.preview = null;

    this._dataObserver.setState(state);
  }
};
