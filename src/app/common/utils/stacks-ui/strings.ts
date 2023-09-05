/* eslint-disable */
// taken from ui-core './strings.esm.js';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// FIXME - refactor this function to use TS + pass esLint
export function truncateMiddle(input, offset = 5) {
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
