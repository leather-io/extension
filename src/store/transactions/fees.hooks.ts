import { useCallback } from 'react';
import { useAtom } from 'jotai';
import { useAtomCallback } from 'jotai/utils';

import { LoadingKeys } from '@common/hooks/use-loading';
import { useSubmitTransactionCallback } from '@common/hooks/use-submit-stx-transaction';
import { useRawTxIdState } from '@store/transactions/raw.hooks';
import { rawSignedTxState } from '@store/transactions/raw';
import { feeState, feeEstimationsState } from '@store/transactions/fees';

export function useFeeEstimationsState() {
  return useAtom(feeEstimationsState);
}

export function useFeeState() {
  return useAtom(feeState);
}

export const useReplaceByFeeSubmitCallBack = () => {
  const [, setTxId] = useRawTxIdState();
  const [, setFee] = useFeeState();

  const submitTransaction = useSubmitTransactionCallback({
    onClose: () => {
      setTxId(null);
      setFee(null);
    },
    loadingKey: LoadingKeys.INCREASE_FEE_DRAWER,
    replaceByFee: true,
  });

  return useAtomCallback<void, { fee: number; nonce: number }>(
    useCallback(
      async get => {
        const signedTx = await get(rawSignedTxState, true);
        if (!signedTx) return;
        await submitTransaction(signedTx);
      },
      [submitTransaction]
    )
  );
};
