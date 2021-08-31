import { useAtomCallback, useAtomValue } from 'jotai/utils';
import {
  currentFeeRateState,
  currentFeeState,
  feeRateState,
  feeRateMultiplierState,
  feeRateMultiplierCustomState,
  feeRateUseCustom,
} from '@store/transactions/fees';
import { useAtom } from 'jotai';
import { useRawTxIdState } from '@store/transactions/raw.hooks';
import { useSubmitTransactionCallback } from '@pages/transaction-signing/hooks/use-submit-stx-transaction';
import { useCallback } from 'react';
import { rawSignedStacksTransactionState } from '@store/transactions/raw';

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

export const useReplaceByFeeSubmitCallBack = () => {
  const [, setMultiplier] = useFeeRateMultiplierCustom();
  const [, setUseCustom] = useFeeRateUseCustom();
  const [, setFeeRate] = useFeeRate();
  const [, setTxId] = useRawTxIdState();

  const submitTransaction = useSubmitTransactionCallback({
    onClose: () => {
      setTxId(null);
      setUseCustom(false);
      setMultiplier(undefined);
      setFeeRate(undefined);
    },
    loadingKey: 'speed',
    replaceByFee: true,
  });

  return useAtomCallback<void, { fee: number; nonce: number }>(
    useCallback(
      async get => {
        const signedTx = await get(rawSignedStacksTransactionState, true);
        if (!signedTx) return;
        await submitTransaction(signedTx);
      },
      [submitTransaction]
    )
  );
};
