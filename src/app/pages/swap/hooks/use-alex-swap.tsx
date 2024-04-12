import { useState } from 'react';

import BigNumber from 'bignumber.js';

import { logger } from '@shared/logger';
import { alex } from '@shared/utils/alex-sdk';

import { type SwapAsset, useAlexSwappableAssets } from '@app/query/common/alex-sdk/alex-sdk.hooks';

import { SwapSubmissionData } from '../swap.context';

export const oneHundredMillion = 100_000_000;

export function useAlexSwap() {
  const [swapSubmissionData, setSwapSubmissionData] = useState<SwapSubmissionData>();
  const [slippage, _setSlippage] = useState(0.04);
  const [isFetchingExchangeRate, setIsFetchingExchangeRate] = useState(false);
  const { data: swapAssets = [] } = useAlexSwappableAssets();

  async function fetchQuoteAmount(
    base: SwapAsset,
    quote: SwapAsset,
    baseAmount: string
  ): Promise<string | undefined> {
    const amount = new BigNumber(baseAmount).multipliedBy(oneHundredMillion).dp(0).toString();
    const amountAsBigInt = isNaN(Number(amount)) ? BigInt(0) : BigInt(amount);
    try {
      setIsFetchingExchangeRate(true);
      const result = await alex.getAmountTo(base.currency, amountAsBigInt, quote.currency);
      setIsFetchingExchangeRate(false);
      return new BigNumber(Number(result)).dividedBy(oneHundredMillion).toString();
    } catch (e) {
      logger.error('Error fetching exchange rate from ALEX', e);
      setIsFetchingExchangeRate(false);
      return;
    }
  }

  return {
    fetchQuoteAmount,
    isFetchingExchangeRate,
    onSetIsFetchingExchangeRate: (value: boolean) => setIsFetchingExchangeRate(value),
    onSetSwapSubmissionData: (value: SwapSubmissionData) => setSwapSubmissionData(value),
    slippage,
    swapAssets,
    swapSubmissionData,
  };
}
