import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { StacksTransaction } from '@stacks/transactions';

import { logger } from '@shared/logger';
import { RouteUrls } from '@shared/route-urls';

import { LoadingKeys } from '@app/common/hooks/use-loading';
import { useSubmitTransactionCallback } from '@app/common/hooks/use-submit-stx-transaction';
import { useRawTxIdState } from '@app/store/transactions/raw.hooks';

import { useSignStacksTransaction } from './transaction.hooks';

export const useReplaceByFeeSoftwareWalletSubmitCallBack = () => {
  const [, setTxId] = useRawTxIdState();
  const signTx = useSignStacksTransaction();
  const navigate = useNavigate();

  const submitTransaction = useSubmitTransactionCallback({
    loadingKey: LoadingKeys.INCREASE_FEE_DRAWER,
  });

  return useCallback(
    async (rawTx: StacksTransaction) => {
      if (!rawTx) return;
      const signedTx = await signTx(rawTx);
      if (!signedTx) {
        logger.warn('Error signing transaction when replacing by fee');
        return;
      }
      await submitTransaction({
        onSuccess() {
          setTxId(null);
          navigate(RouteUrls.IncreaseFeeSent);
        },
        onError() {
          logger.error('Error submitting transaction');
        },
        replaceByFee: true,
      })(signedTx);
    },
    [navigate, setTxId, signTx, submitTransaction]
  );
};
