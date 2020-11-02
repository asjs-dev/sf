const getClassNames = (target) => target.className.split(" ");

const addClass = (target, className) => {
  !hasClass(target, className) && (target.className += " " + className);
  return target;
}

const removeClass = (target, className) => {
  let classNames     = getClassNames(target);
  let classNameIndex = classNames.indexOf(className);

  if (classNameIndex > -1)
    classNames.splice(classNameIndex, 1);

  target.className = classNames.join(" ");

  return target;
}

const hasClass = (target, className) => getClassNames(target).indexOf(className) > -1;

const getRandomFromArray = (random, array) => array[Math.floor(random * array.length)];

const areRectsCollided = (a, b) => a.x + a.width > b.x &&
                                   a.x < b.x + b.width &&
                                   a.y + a.height > b.y &&
                                   a.y < b.y + b.height;

const getTwoRectsCenter = (a, b) => {
  let minX = Math.min(a.x, b.x);
  let minY = Math.min(a.y, b.y);
  let maxX = Math.max(a.x + a.width,  b.x + b.width);
  let maxY = Math.max(a.y + a.height, b.y + b.height);

  return {
    x : minX + (maxX - minX) / 2,
    y : minY + (maxY - minY) / 2
  };
}

const rgbToInt = (r, g, b)  => {
  r &= 0xFF;
  g &= 0xFF;
  b &= 0xFF;

  return (r << 16) | (g << 8) | b;
}

const intToRgb = (num) => {
  num >>>= 0;
  return {
    r : (num & 0xFF0000) >>> 16,
    g : (num & 0xFF00) >>> 8,
    b : num & 0xFF
  };
}

const intToRgbFloat = (num) => {
  let rgb = intToRgb(num);
      rgb.r /= 255;
      rgb.g /= 255;
      rgb.b /= 255;
  return rgb;
}

const getAnimatedColor = (from, to, step) => rgbToInt(
                                              from.r + (to.r - from.r) * step,
                                              from.g + (to.g - from.g) * step,
                                              from.b + (to.b - from.b) * step,
                                            );

const between = (min, max, value) => Math.max(min, Math.min(max, value));

const easeInOut = (t) => t < 0.5
                          ? 4 * t * t * t
                          : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

const is = (a, b) => a instanceof b;

const deepFreeze = (object) => {
  let propNames = Object.getOwnPropertyNames(object);

  for (let name of propNames) {
    let value = object[name];
    if (value && typeof value === "object") deepFreeze(value);
  }

  return Object.freeze(object);
}
