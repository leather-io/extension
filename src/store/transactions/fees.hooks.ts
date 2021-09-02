import { useCallback } from 'react';
import { useAtomCallback, useAtomValue } from 'jotai/utils';
import {
  currentFeeState,
  currentDefaultFeeState,
  feeRateState,
  customAbsoluteTxFee,
} from '@store/transactions/fees';
import { useAtom } from 'jotai';
import { useRawTxIdState } from '@store/transactions/raw.hooks';
import { useSubmitTransactionCallback } from '@pages/transaction-signing/hooks/use-submit-stx-transaction';
import { rawSignedStacksTransactionState } from '@store/transactions/raw';
import { LOADING_KEYS } from '@common/hooks/use-loading';

export function useCurrentFee() {
  return useAtomValue(currentFeeState);
}

export function useCurrentDefaultFee() {
  return useAtomValue(currentDefaultFeeState);
}

export function useCustomAbsoluteFee() {
  return useAtom(customAbsoluteTxFee);
}

export function useFeeRate() {
  return useAtom(feeRateState);
}

export const useReplaceByFeeSubmitCallBack = () => {
  const [, setTxId] = useRawTxIdState();
  const [, setCustomAbsoluteFee] = useCustomAbsoluteFee();

  const submitTransaction = useSubmitTransactionCallback({
    onClose: () => {
      setTxId(null);
      setCustomAbsoluteFee(null);
    },
    loadingKey: LOADING_KEYS.INCREASE_FEE_DRAWER,
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
