import {addClass, removeClass} from "../utility/utils.js";
import Config from "../Config.js";
import AbstractViewController from "./AbstractViewController.js";

export default class StatusViewController extends AbstractViewController {
  constructor(dataObserver) {
    super(dataObserver);

    this._MAX_ROCKETS = Config.maxRockets;

    this._container = document.querySelector(".status-screen");

    this._rocketStatusContainer = this._container.querySelector(".status-rockets");
    this._rocketStatusDisplay   = this._rocketStatusContainer.querySelector(".status-line");
    this._killStatusDisplay     = this._container.querySelector(".status-kills label");

    this._dataObserver.on("status", this._onDORocketsChange.bind(this));
    this._dataObserver.on("view",   this._onDOViewChange.bind(this));
  }

  _updateRockets(value) {
    this._rocketStatusDisplay.style.width = ((value / this._MAX_ROCKETS) * 100) + "%";
    value < 6
      ? addClass(this._rocketStatusContainer, "alert")
      : removeClass(this._rocketStatusContainer, "alert");
  }

  _updateKills(value) {
    this._killStatusDisplay.innerText = value;
  }

  _onDORocketsChange(state, prevState) {
    this._updateRockets(state.rockets);
    this._updateKills(state.kills);
  }

  _onDOViewChange(state, prevState) {
    state === "game"
      ? this._show()
      : this._hide();
  }
};
