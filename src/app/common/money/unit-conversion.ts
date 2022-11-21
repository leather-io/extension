import BigNumber from 'bignumber.js';

import { BTC_DECIMALS, STX_DECIMALS } from '@shared/constants';

import { initBigNumber } from '../utils';

function fractionalUnitToUnit(decimals: number) {
  return (unit: number | string | BigNumber) => {
    const satBigNumber = initBigNumber(unit);
    return satBigNumber.shiftedBy(-decimals);
  };
}

function unitToFractionalUnit(decimals: number) {
  return (unit: number | string | BigNumber) => {
    const satBigNumber = initBigNumber(unit);
    return satBigNumber.shiftedBy(decimals);
  };
}

export const satToBtc = fractionalUnitToUnit(BTC_DECIMALS);

export const microStxToStx = fractionalUnitToUnit(STX_DECIMALS);
export const stxToMicroStx = unitToFractionalUnit(STX_DECIMALS);
