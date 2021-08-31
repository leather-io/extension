import { useAtomValue } from 'jotai/utils';
import {
  currentFeeRateState,
  currentFeeState,
  feeRateState,
  feeRateMultiplierState,
  feeRateMultiplierCustomState,
  feeRateUseCustom,
} from '@store/transactions/fees';
import { useAtom } from 'jotai';

export function useCurrentFee() {
  return useAtomValue(currentFeeState);
}

export function useFeeRateMultiplier() {
  return useAtom(feeRateMultiplierState);
}

export function useFeeRateMultiplierCustom() {
  return useAtom(feeRateMultiplierCustomState);
}

export function useFeeRateUseCustom() {
  return useAtom(feeRateUseCustom);
}

export function useFeeRate() {
  return useAtom(feeRateState);
}

export function useCurrentFeeRate() {
  return useAtom(currentFeeRateState);
}
