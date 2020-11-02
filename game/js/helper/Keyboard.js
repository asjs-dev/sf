SF.Keyboard = createClass(
  Object,
  function Keyboard() {
    Object.call(this);

    this._pressedKeys = {};

    window.addEventListener("keydown", this._onKeyDown.bind(this));
    window.addEventListener("keyup", this._onKeyUp.bind(this));
  },
  function(_scope) {
    _scope.isPressed = function(key) {
      return this._pressedKeys[key];
    }

    _scope._onKeyDown = function(event) {
      this._pressedKeys[event.keyCode] = true;
    }

    _scope._onKeyUp = function(event) {
      this._pressedKeys[event.keyCode] = false;
    }
  }
);
