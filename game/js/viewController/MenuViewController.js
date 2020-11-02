SF.MenuViewController = createClass(
  SF.AbstractViewController,
  function MenuViewController(dataObserver) {
    SF.AbstractViewController.call(this, dataObserver);

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
  },
  function(_scope, _super) {
    _scope._show = function() {
      _super._show.call(this);

      this._gameButtons.addEventListener("click", this._buttonClickBound);
      this._exitButton.addEventListener("click",  this._onExitClickBound);
    }

    _scope._hide = function() {
      _super._hide.call(this);

      this._gameButtons.removeEventListener("click", this._buttonClickBound);
      this._exitButton.removeEventListener("click",  this._onExitClickBound);
    }

    _scope._showPreview = function(preview) {
      addClass(this._preview, "show");
      this._preview.style.backgroundImage = "url(img/game-preview/" + preview + ")";
    }

    _scope._hidePreview = function() {
      removeClass(this._preview, "show");
    }

    _scope._exit = function() {
      window.top.location.href = SF.Config.landingPage;
    }

    _scope._onDOViewChange = function(state, prevState) {
      switch (state) {
        case "menu": this._show();
          break;
        case "exit": this._exit();
          break;
        default:     this._hide();
          break;
      }
    }

    _scope._onDOPreviewChange = function(state, prevState) {
      state
        ? this._showPreview(state)
        : this._hidePreview();
    }

    _scope._onExitClick = function() {
      var state = this._dataObserver.getState();
          state.view = "exit";

      this._dataObserver.setState(state);
    }

    _scope._onMenuButtonClick = function(event) {
      var state         = this._dataObserver.getState();
          state.view    = "game";
          state.levelId = event.target.dataset["levelId"];

      this._dataObserver.setState(state);
    }

    _scope._onMenuButtonMouseOver = function(event) {
      var state         = this._dataObserver.getState();
          state.preview = event.target.dataset["levelPreview"];

      this._dataObserver.setState(state);
    }

    _scope._onMenuButtonMouseOut = function(event) {
      var state         = this._dataObserver.getState();
          state.preview = null;

      this._dataObserver.setState(state);
    }
  }
);
