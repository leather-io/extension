import BigNumber from 'bignumber.js';

import { BTC_DECIMALS, STX_DECIMALS } from '@shared/constants';
import { Money } from '@shared/models/money.model';

import { initBigNumber } from '../utils';

function fractionalUnitToUnit(decimals: number) {
  return (unit: number | string | BigNumber) => {
    const unitBigNumber = initBigNumber(unit);
    return unitBigNumber.shiftedBy(-decimals);
  };
}

function unitToFractionalUnit(decimals: number) {
  return (unit: number | string | BigNumber) => {
    const unitBigNumber = initBigNumber(unit);
    return unitBigNumber.shiftedBy(decimals);
  };
}

export const satToBtc = fractionalUnitToUnit(BTC_DECIMALS);
export const btcToSat = unitToFractionalUnit(BTC_DECIMALS);

export const microStxToStx = fractionalUnitToUnit(STX_DECIMALS);
export const stxToMicroStx = unitToFractionalUnit(STX_DECIMALS);

export function moneyToBaseUnit(sum: Money) {
  return fractionalUnitToUnit(sum.decimals)(sum.amount);
}
