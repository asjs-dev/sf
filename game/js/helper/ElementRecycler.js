SF.ElementRecycler = createClass(
  Object,
  function ElementRecycler() {
    Object.call(this);

    this._list = [];
  },
  function(_scope) {
    _scope.add = function(rect, element) {
      this._list.push(element);
    }

    _scope.get = function(type) {
      var element;
      for (var i = 0, l = this._list.length; i < l; ++i) {
        element = this._list[i];
        if (is(element, type)) {
          this._list.splice(i, 1);
          return element;
        }
      }

      return null;
    }
  }
);
