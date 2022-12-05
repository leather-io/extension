import { ChainID } from '@stacks/transactions';
import BigNumber from 'bignumber.js';
import { c32addressDecode } from 'c32check';

import { NetworkConfiguration, STX_DECIMALS } from '@shared/constants';

import { abbreviateNumber, initBigNumber } from '@app/common/utils';

import { microStxToStx } from './money/unit-conversion';

export const stacksValue = ({
  value,
  fixedDecimals = true,
  withTicker = true,
  abbreviate = false,
}: {
  value: number | string | BigNumber;
  fixedDecimals?: boolean;
  withTicker?: boolean;
  abbreviate?: boolean;
}) => {
  const stacks = microStxToStx(value);
  const stxAmount = stacks.toNumber();
  return `${
    abbreviate && stxAmount > 10000
      ? abbreviateNumber(stxAmount)
      : stxAmount.toLocaleString('en-US', {
          maximumFractionDigits: fixedDecimals ? STX_DECIMALS : 3,
        })
  }${withTicker ? ' STX' : ''}`;
};

export const ftDecimals = (value: number | string | BigNumber, decimals: number) => {
  const amount = initBigNumber(value);
  return amount
    .shiftedBy(-decimals)
    .toNumber()
    .toLocaleString('en-US', { maximumFractionDigits: decimals });
};

export const ftUnshiftDecimals = (value: number | string | BigNumber, decimals: number) => {
  const amount = initBigNumber(value);
  return amount.shiftedBy(decimals).toString(10);
};

export const validateStacksAddress = (stacksAddress: string): boolean => {
  try {
    c32addressDecode(stacksAddress);
    return true;
  } catch (e) {
    return false;
  }
};

export function validateAddressChain(address: string, currentNetwork: NetworkConfiguration) {
  const prefix = address.slice(0, 2);
  if (currentNetwork.chain.stacks.chainId === ChainID.Testnet)
    return prefix === 'SN' || prefix === 'ST';
  if (currentNetwork.chain.stacks.chainId === ChainID.Mainnet)
    return prefix === 'SM' || prefix === 'SP';
  return false;
}
