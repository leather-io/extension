/* eslint-disable */
// taken from ui-core './units.esm.js';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// FIXME - refactor this function to use TS + pass esLint
import { withSTX } from './strings';

var MICROSTACKS_IN_STACKS = 1e6;
function microStxToStx(microStx) {
  return Number(Number(microStx) / Math.pow(10, 6));
}
function toHumanReadableStx(microStx) {
  return withSTX(
    microStxToStx(microStx).toLocaleString(void 0, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    })
  );
}
function stxToMicroStx(amountInStacks) {
  return amountInStacks ? Math.floor(Number(amountInStacks) * MICROSTACKS_IN_STACKS) : 0;
}

export { microStxToStx, stxToMicroStx, toHumanReadableStx };
