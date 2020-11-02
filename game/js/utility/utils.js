function getClassNames(target) {
  return target.className.split(" ");
}

function addClass(target, className) {
  !hasClass(target, className) && (target.className += " " + className);
  return target;
}

function removeClass(target, className) {
  var classNames     = getClassNames(target);
  var classNameIndex = classNames.indexOf(className);

  if (classNameIndex > -1)
    classNames.splice(classNameIndex, 1);

  target.className = classNames.join(" ");

  return target;
}

function hasClass(target, className) {
  return getClassNames(target).indexOf(className) > -1;
}

function property(target, name, descriptor) {
  descriptor.enumerable   = true;
  descriptor.configurable = true;

  Object.defineProperty(target, name, descriptor);
}

function get(target, name, value) {
  property(target, name, {get: value});
};

function set(target, name, value) {
  property(target, name, {set: value});
};

function getRandomFromArray(random, array) {
  return array[Math.floor(random * array.length)];
}

function areRectsCollided(a, b) {
  return a.x + a.width > b.x &&
         a.x < b.x + b.width &&
         a.y + a.height > b.y &&
         a.y < b.y + b.height;
}

function getTwoRectsCenter(a, b) {
  var minX = Math.min(a.x, b.x);
  var minY = Math.min(a.y, b.y);
  var maxX = Math.max(a.x + a.width,  b.x + b.width);
  var maxY = Math.max(a.y + a.height, b.y + b.height);

  return {
    x : minX + (maxX - minX) / 2,
    y : minY + (maxY - minY) / 2
  };
}

function rgbToInt(r, g, b) {
  r &= 0xFF;
  g &= 0xFF;
  b &= 0xFF;

  return (r << 16) | (g << 8) | b;
}

function intToRgb(num) {
  num >>>= 0;
  return {
    r : (num & 0xFF0000) >>> 16,
    g : (num & 0xFF00) >>> 8,
    b : num & 0xFF
  };
}

function intToRgbFloat(num) {
  var rgb = intToRgb(num);
  rgb.r /= 255;
  rgb.g /= 255;
  rgb.b /= 255;
  return rgb;
}

function getAnimatedColor(from, to, step) {
  return rgbToInt(
    from.r + (to.r - from.r) * step,
    from.g + (to.g - from.g) * step,
    from.b + (to.b - from.b) * step,
  );
}

function between(min, max, value) {
  return Math.max(min, Math.min(max, value));
}

function easeInOut(t) {
  return t < 0.5
    ? 4 * t * t * t
    : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

function is(a, b) {
  return a instanceof b;
}

function deepFreeze(object) {
  var propNames = Object.getOwnPropertyNames(object);

  for (var name of propNames) {
    var value = object[name];
    if (value && typeof value === "object") deepFreeze(value);
  }

  return Object.freeze(object);
}

function createClass(parent, construct, body) {
  var _super = parent.prototype;
  var _scope = construct.prototype;

  Object.setPrototypeOf(construct, parent);
  Object.setPrototypeOf(_scope, _super);

  _scope.constructor = construct;

  body && body.call(_scope, _scope, _super);

  return construct;
}

function createClassExtension(construct, body) {
  return {
    extendConstructor   : construct,
    extendFunctionality : body
  };
}
