import { useCallback } from 'react';
import { useAtom } from 'jotai';
import { useAtomCallback } from 'jotai/utils';

import { LoadingKeys } from '@app/common/hooks/use-loading';
import { useSubmitTransactionCallback } from '@app/common/hooks/use-submit-stx-transaction';
import { useRawTxIdState } from '@app/store/transactions/raw.hooks';
import { rawSignedTxState } from '@app/store/transactions/raw';
import { feeEstimationsState } from '@app/store/transactions/fees';

export function useFeeEstimationsState() {
  return useAtom(feeEstimationsState);
}

export const useReplaceByFeeSubmitCallBack = () => {
  const [, setTxId] = useRawTxIdState();

  const submitTransaction = useSubmitTransactionCallback({
    loadingKey: LoadingKeys.INCREASE_FEE_DRAWER,
  });

  return useAtomCallback<void, { fee: number; nonce: number }>(
    useCallback(
      async get => {
        const signedTx = await get(rawSignedTxState, true);
        if (!signedTx) return;
        await submitTransaction({
          onClose: () => {
            setTxId(null);
          },
          replaceByFee: true,
        })(signedTx);
      },
      [setTxId, submitTransaction]
    )
  );
};
