SF.AbstractLevel = createClass(
  SF.BaseClass,
  function AbstractLevel() {
    SF.BaseClass.call(this);

    this.BACKGROUND_COLOR = 0x000000;
    this.FIELD_COLOR      = 0x000000;
    this.TIME_SCALE       = 1;
  },
  function(_scope) {
    _scope.setupElement = function(state, element) {}
  }
);
