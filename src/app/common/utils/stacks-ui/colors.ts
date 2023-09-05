/* eslint-disable */
// taken from ui-core './colors.esm.js';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

function generateHash(str) {
  var hash = 0;

  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }

  return hash;
}
function hashValue(str, options) {
  var hash = generateHash(str);
  hash = ((hash % options.length) + options.length) % options.length;
  return options[hash];
}
function stringToHslColor(str, saturation, lightness) {
  var hash = generateHash(str);
  var hue = hash % 360;
  return 'hsl(' + hue + ', ' + saturation + '%, ' + lightness + '%)';
}
function moduloRange(x, range, includeMax) {
  if (includeMax === void 0) {
    includeMax = false;
  }

  var max = range[1],
    min = range[0],
    d = max - min;
  return x === max && includeMax ? x : ((((x - min) % d) + d) % d) + min;
}
var color = function color(name) {
  return 'var(--colors-' + name + ')';
};

export { color, generateHash, hashValue, moduloRange, stringToHslColor };
//# sourceMappingURL=colors.esm.js.map
