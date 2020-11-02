SF.Keyboard = class Keyboard {
  constructor() {
    this._pressedKeys = {};

    window.addEventListener("keydown", this._onKeyDown.bind(this));
    window.addEventListener("keyup", this._onKeyUp.bind(this));
  }

  isPressed(key) {
    return this._pressedKeys[key];
  }

  _onKeyDown(event) {
    this._pressedKeys[event.keyCode] = true;
  }

  _onKeyUp(event) {
    this._pressedKeys[event.keyCode] = false;
  }
};
