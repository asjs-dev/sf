SF.LevelMenuBackground = createClass(
  SF.AbstractLevel,
  function LevelMenuBackground() {
    SF.AbstractLevel.call(this);

    this.BACKGROUND_COLOR = 0x000033;
    this.FIELD_COLOR      = 0x1327B1;
    this.TIME_SCALE       = 0.25;
  },
  function(_scope) {
    _scope.setupElement = function(state, element) {
      var sizeConfig = SF.Config.size;

      var z = Math.random();

      element.reset(
        state,
        "Cloud",
        0.5, 0.5,
        between(0.5, 2, Math.random()),
        between(0.5, 2, Math.random()),
        sizeConfig.height * Math.random(),
        z,
        rgbToInt(
          Math.random() * 255,
          Math.random() * 255,
          Math.random() * 255
        ),
        z * 0.5,
        1
      );
    }
  }
);
