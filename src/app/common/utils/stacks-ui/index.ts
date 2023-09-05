/* eslint-disable */
// taken from ui-core './strings.esm.js';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
function capitalize(s) {
  return (s == null ? void 0 : s.charAt(0).toUpperCase()) + (s == null ? void 0 : s.slice(1));
}
function with0x(str) {
  return str.includes('.') ? str : !str.includes('0x') ? '0x' + str : str;
}
function truncateHex(hex, offset) {
  if (offset === void 0) {
    offset = 5;
  }

  return hex.substring(0, offset + 2) + '\u2026' + hex.substring(hex.length - offset);
}
function truncateMiddle(input, offset = 5) {
  if (!input) return '';

  if (input.startsWith('0x')) {
    return truncateHex(input, offset);
  }

  if (input.includes('.')) {
    var _parts$, _parts$2;

    var parts = input.split('.');
    var start = (_parts$ = parts[0]) == null ? void 0 : _parts$.substr(0, offset);
    var end =
      (_parts$2 = parts[0]) == null
        ? void 0
        : _parts$2.substr(parts[0].length - offset, parts[0].length);
    return start + '\u2026' + end + '.' + parts[1];
  } else {
    var _start = input == null ? void 0 : input.substr(0, offset);

    var _end = input == null ? void 0 : input.substr(input.length - offset, input.length);

    return _start + '\u2026' + _end;
  }
}
function withSTX(amount) {
  return amount + ' STX';
}
function addSepBetweenStrings(strings, sep) {
  if (sep === void 0) {
    sep = '\u2219';
  }

  var str = '';
  strings
    .filter(function (_s) {
      return _s;
    })
    .forEach(function (string, index, array) {
      if (index < array.length - 1) {
        str += string + (' ' + sep + ' ');
      } else {
        str += string;
      }
    });
  return str;
}

export { addSepBetweenStrings, capitalize, truncateHex, truncateMiddle, with0x, withSTX };
//# sourceMappingURL=strings.esm.js.map
