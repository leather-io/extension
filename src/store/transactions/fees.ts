import { atom } from 'jotai';
import { DEFAULT_FEE_RATE } from '@store/common/constants';
import { txForSettingsState } from '@store/transactions/index';
import { calculateFeeFromFeeRate } from '@store/transactions/utils';

export const feeRateState = atom(DEFAULT_FEE_RATE);

export const customAbsoluteTxFee = atom<number | null>(null);

export const currentFeeState = atom(get => {
  const transaction = get(txForSettingsState);
  return transaction?.auth.spendingCondition?.fee.toNumber() || 0;
});

export const currentDefaultFeeState = atom(get => {
  const transaction = get(txForSettingsState);
  if (!transaction) return;
  return calculateFeeFromFeeRate(transaction, DEFAULT_FEE_RATE);
});
