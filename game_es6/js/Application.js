import DataObserver from "./utility/DataObserver.js";
import BaseClass from "./helper/BaseClass.js";
import Renderer from "./renderer/Renderer.js";
import Config from "./Config.js";
import GameViewController from "./viewController/GameViewController.js";
import MenuViewController from "./viewController/MenuViewController.js";
import StatusViewController from "./viewController/StatusViewController.js";
import SplashViewController from "./viewController/SplashViewController.js";

class Application extends BaseClass {
  constructor() {
    super();

    this._dataObserver = new DataObserver();

    this._baseTexture;

    this._renderer;

    this._views = [];

    this._updateBound = this.update.bind(this);
    document.addEventListener("DOMContentLoaded", this._onDOMContentLoad.bind(this));
  }

  update() {
    let state = this._dataObserver.getState();

    state.time = Date.now();

    for (let i = 0, l = this._views.length; i < l; ++i) this._views[i].update(state);

    this._dataObserver.setState(state);

    requestAnimationFrame(this._updateBound);
  }

  _setup() {
    this._baseTexture = PIXI.BaseTexture.from("img/assets.png");
    this._baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

    this._renderer = new Renderer(
      this._baseTexture,
      {
        width           : Config.size.width,
        height          : Config.size.height,
        backgroundColor : 0x000000
      }
    );

    this._views.push(new GameViewController(this._dataObserver, this._renderer, this._baseTexture));
    this._views.push(new StatusViewController(this._dataObserver));
    this._views.push(new MenuViewController(this._dataObserver));
    this._views.push(new SplashViewController(this._dataObserver));

    this._dataObserver.setState(Config.defaultState);

    this.update();
  }

  _loadAssets() {
    PIXI.Loader.shared.add("img/assets.png").load(this._setup.bind(this));
  }

  _onDOMContentLoad() {
    this._loadAssets();
  }
};

new Application();
