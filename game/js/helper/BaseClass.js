SF.BaseClass = createClass(
  Object,
  function BaseClass() {
    Object.call(this);
  },
  function(_scope) {
    _scope.update = function(state) {}
  }
);
