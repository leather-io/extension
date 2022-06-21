import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { useAtomCallback } from 'jotai/utils';

import { LoadingKeys } from '@app/common/hooks/use-loading';
import { useSubmitTransactionCallback } from '@app/common/hooks/use-submit-stx-transaction';
import { useRawTxIdState } from '@app/store/transactions/raw.hooks';
import { rawDeserializedTxState } from '@app/store/transactions/raw';
import { feeEstimationsState } from '@app/store/transactions/fees';
import { RouteUrls } from '@shared/route-urls';

import { useSignTransactionSoftwareWallet } from './transaction.hooks';

export function useFeeEstimationsState() {
  return useAtom(feeEstimationsState);
}

export const useReplaceByFeeSoftwareWalletSubmitCallBack = () => {
  const [, setTxId] = useRawTxIdState();
  const signTx = useSignTransactionSoftwareWallet();
  const navigate = useNavigate();

  const submitTransaction = useSubmitTransactionCallback({
    loadingKey: LoadingKeys.INCREASE_FEE_DRAWER,
  });

  return useAtomCallback<void, { fee: number; nonce: number }>(
    useCallback(
      async get => {
        const unsignedTx = await get(rawDeserializedTxState, { unstable_promise: true });
        if (!unsignedTx) return;
        const signedTx = signTx(unsignedTx);
        if (!signedTx) return;
        await submitTransaction({
          onClose: () => {
            setTxId(null);
            navigate(RouteUrls.Home);
          },
          replaceByFee: true,
        })(signedTx);
      },
      [navigate, setTxId, signTx, submitTransaction]
    )
  );
};
