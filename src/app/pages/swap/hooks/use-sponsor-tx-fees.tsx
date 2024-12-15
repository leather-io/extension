import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useStxCryptoAssetBalance } from '@leather.io/query';

import { logger } from '@shared/logger';
import type { SwapFormValues } from '@shared/models/form.model';
import { RouteUrls } from '@shared/route-urls';

import { LoadingKeys, useLoading } from '@app/common/hooks/use-loading';
import { useToast } from '@app/features/toasts/use-toast';
import { useConfigSbtc } from '@app/query/common/remote-config/remote-config.query';
import {
  type SbtcSponsorshipEligibility,
  type TransactionBase,
  submitSponsoredSbtcTransaction,
  verifySponsoredSbtcTransaction,
} from '@app/query/sbtc/sponsored-transactions.query';
import { useCurrentStacksAccountAddress } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useSignStacksTransaction } from '@app/store/transactions/transaction.hooks';

// TODO: Check sBTC balance is able to pay fee amount
export function useSponsorTransactionFees() {
  const [verificationResult, setVerificationResult] = useState<
    SbtcSponsorshipEligibility | undefined
  >();
  const [isEligibleForSponsor, setIsEligibleForSponsor] = useState(false);
  const { isSbtcSwapsEnabled } = useConfigSbtc();
  const stxAddress = useCurrentStacksAccountAddress();
  const { filteredBalanceQuery } = useStxCryptoAssetBalance(stxAddress);
  const { setIsIdle } = useLoading(LoadingKeys.SUBMIT_SWAP_TRANSACTION);
  const signTx = useSignStacksTransaction();
  const navigate = useNavigate();
  const toast = useToast();

  const checkEligibilityForSponsor = useCallback(
    (values: SwapFormValues, baseTx: TransactionBase) => {
      const isSwapAssetBaseSbtc = values.swapAssetBase?.name === 'sBTC';
      const isSwapAssetQuoteSbtc = values.swapAssetQuote?.name === 'sBTC';
      const isSbtcBeingSwappedAndEligible =
        (isSwapAssetBaseSbtc && values.swapAssetBase?.balance.amount.isGreaterThan(0)) ||
        (isSwapAssetQuoteSbtc && values.swapAssetQuote?.balance.amount.isGreaterThan(0));

      const isZeroStxBalance = filteredBalanceQuery.data?.availableBalance.amount.isEqualTo(0);

      verifySponsoredSbtcTransaction({
        baseTx,
        nonce: Number(values.nonce),
      })
        .then(result => {
          setVerificationResult(result);
        })
        .catch(e => {
          logger.error('Verification failure: ', e);
          setVerificationResult({ isEligible: false });
        })
        .finally(() => {
          setIsIdle;
        });

      setIsEligibleForSponsor(
        !!(
          verificationResult?.isEligible &&
          isZeroStxBalance &&
          isSbtcSwapsEnabled &&
          isSbtcBeingSwappedAndEligible
        )
      );
    },
    [
      filteredBalanceQuery.data?.availableBalance.amount,
      isSbtcSwapsEnabled,
      setIsIdle,
      verificationResult?.isEligible,
    ]
  );

  const submitSponsoredTx = useCallback(async () => {
    if (isEligibleForSponsor) {
      try {
        const signedSponsoredTx = await signTx(verificationResult?.unsignedSponsoredTx!);
        if (!signedSponsoredTx) return logger.error('Unable to sign sponsored transaction!');

        const result = await submitSponsoredSbtcTransaction(signedSponsoredTx);
        if (!result.txId)
          navigate(RouteUrls.TransactionBroadcastError, { state: { message: result.error } });

        toast.success('Transaction submitted!');
        setIsIdle();
        navigate(RouteUrls.Activity);
      } catch (error) {
        return logger.error('Failed to submit sponsor transaction', error);
      }
    }
  }, [
    isEligibleForSponsor,
    navigate,
    setIsIdle,
    signTx,
    toast,
    verificationResult?.unsignedSponsoredTx,
  ]);

  return {
    isEligibleForSponsor,
    checkEligibilityForSponsor,
    submitSponsoredTx,
  };
}
