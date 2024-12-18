import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import type { StacksTransaction } from '@stacks/transactions';

import { FeeTypes } from '@leather.io/models';
import { defaultFeesMaxValuesAsMoney } from '@leather.io/query';

import { logger } from '@shared/logger';
import type { SwapFormValues } from '@shared/models/form.model';
import { RouteUrls } from '@shared/route-urls';

import { LoadingKeys, useLoading } from '@app/common/hooks/use-loading';
import { useToast } from '@app/features/toasts/use-toast';
import { useConfigSbtc } from '@app/query/common/remote-config/remote-config.query';
import {
  type TransactionBase,
  submitSponsoredSbtcTransaction,
  verifySponsoredSbtcTransaction,
} from '@app/query/sbtc/sponsored-transactions.query';
import { useSignStacksTransaction } from '@app/store/transactions/transaction.hooks';

export function useSponsorTransactionFees() {
  const { sponsorshipApiUrl } = useConfigSbtc();
  const { setIsIdle } = useLoading(LoadingKeys.SUBMIT_SWAP_TRANSACTION);
  const signTx = useSignStacksTransaction();
  const navigate = useNavigate();
  const toast = useToast();

  const checkEligibilityForSponsor = async (values: SwapFormValues, baseTx: TransactionBase) => {
    return await verifySponsoredSbtcTransaction({
      apiUrl: sponsorshipApiUrl,
      baseTx,
      nonce: Number(values.nonce),
      fee: defaultFeesMaxValuesAsMoney[FeeTypes.Middle].amount.toNumber(),
    });
  };

  const submitSponsoredTx = useCallback(
    async (unsignedSponsoredTx: StacksTransaction) => {
      try {
        const signedSponsoredTx = await signTx(unsignedSponsoredTx);
        if (!signedSponsoredTx) return logger.error('Unable to sign sponsored transaction!');

        const result = await submitSponsoredSbtcTransaction(sponsorshipApiUrl, signedSponsoredTx);
        if (!result.txid) {
          navigate(RouteUrls.SwapError, { state: { message: result.error } });
          return;
        }

        toast.success('Transaction submitted!');
        setIsIdle();
        navigate(RouteUrls.Activity);
      } catch (error) {
        return logger.error('Failed to submit sponsor transaction', error);
      }
    },
    [navigate, setIsIdle, signTx, toast, sponsorshipApiUrl]
  );

  return {
    checkEligibilityForSponsor,
    submitSponsoredTx,
  };
}
