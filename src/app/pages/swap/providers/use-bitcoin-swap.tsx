import { useCallback } from 'react';

import type { P2Ret } from '@scure/btc-signer/payment';

import { BitcoinSigner } from '@leather.io/bitcoin';
import type { SwapAsset, UtxoResponseItem } from '@leather.io/query';
import { delay, isUndefined } from '@leather.io/utils';

import { logger } from '@shared/logger';

import { LoadingKeys, useLoading } from '@app/common/hooks/use-loading';

import { useSbtcDepositTransaction } from '../hooks/use-sbtc-deposit-transaction';
import type { SubmitSwapArgs } from '../swap.context';
import type { BitcoinSwapContext } from './bitcoin-swap-provider';

export function useBitcoinSwap(signer: BitcoinSigner<P2Ret>, utxos: UtxoResponseItem[]) {
  const { setIsLoading, isLoading } = useLoading(LoadingKeys.SUBMIT_SWAP_TRANSACTION);

  const { onDepositSbtc, onReviewDepositSbtc } = useSbtcDepositTransaction(signer, utxos);

  const onSubmitSwapForReview = useCallback(
    async ({ values, swapData, isSendingMax }: SubmitSwapArgs<BitcoinSwapContext>) => {
      if (isUndefined(values.swapAssetBase) || isUndefined(values.swapAssetQuote)) {
        return logger.error('Error submitting swap for review');
      }

      const depositData = await onReviewDepositSbtc({ values, swapData, isSendingMax });
      if (!depositData) return logger.error('No deposit to review');

      return depositData;
    },
    [onReviewDepositSbtc]
  );

  const onSubmitSwap = useCallback(
    async ({ values, swapData }: SubmitSwapArgs<BitcoinSwapContext>) => {
      if (isLoading) return;

      if (isUndefined(values.swapAssetBase) || isUndefined(values.swapAssetQuote)) {
        logger.error('No assets selected to perform swap');
        return;
      }

      setIsLoading();

      return await onDepositSbtc(swapData.deposit);
    },
    [isLoading, onDepositSbtc, setIsLoading]
  );

  // TODO: Implement fetch when exchange rate is available
  const fetchQuoteAmount = useCallback(
    async (base: SwapAsset, quote: SwapAsset, baseAmount: string): Promise<string | undefined> => {
      if (!base || !quote) return;
      await delay(100); // Simulate API call
      // Return 1:1 rate for now
      return baseAmount;
    },
    []
  );

  return {
    fetchQuoteAmount,
    onSubmitSwapForReview,
    onSubmitSwap,
  };
}
