import { useCallback, useMemo, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { AlexSDK, Currency, TokenInfo } from 'alex-sdk';
import BigNumber from 'bignumber.js';

import { logger } from '@shared/logger';
import { createMoney } from '@shared/models/money.model';

import { useAllTransferableCryptoAssetBalances } from '@app/common/hooks/use-transferable-asset-balances.hooks';

import { SwapSubmissionData } from '../swap.context';
import { SwapAsset } from './use-swap';

export const oneHundredMillion = 100_000_000;

export function useAlexSwap() {
  const alexSDK = useState(() => new AlexSDK())[0];
  const [swapSubmissionData, setSwapSubmissionData] = useState<SwapSubmissionData>();
  const [slippage, _setSlippage] = useState(0.04);
  const allTransferableCryptoAssetBalances = useAllTransferableCryptoAssetBalances();
  // TODO: Relocate query
  const { data: supportedCurrencies = [] } = useQuery(
    ['alex-supported-swap-currencies'],
    async () => alexSDK.fetchSwappableCurrency()
  );

  const getAssetFromAlexCurrency = useCallback(
    (tokenInfo?: TokenInfo) => {
      if (!tokenInfo) {
        logger.error('No token data found to swap');
        return;
      }

      const currency = tokenInfo.id as Currency;

      if (currency === Currency.STX) {
        const balance = allTransferableCryptoAssetBalances.find(
          x => x.type === 'crypto-currency' && x.blockchain === 'stacks' && x.asset.symbol === 'STX'
        )?.balance;

        return {
          currency,
          icon: tokenInfo.icon,
          name: tokenInfo.name,
          balance: balance ?? createMoney(0, tokenInfo.name, tokenInfo.decimals),
        };
      }

      const balance = allTransferableCryptoAssetBalances.find(
        x => x.type === 'fungible-token' && alexSDK.getAddressFrom(currency) === x.asset.contractId
      )?.balance;

      return {
        currency,
        icon: tokenInfo.icon,
        name: tokenInfo.name,
        balance: balance ?? createMoney(0, tokenInfo.name, tokenInfo.decimals),
      };
    },
    [alexSDK, allTransferableCryptoAssetBalances]
  );

  async function fetchToAmount(
    from: SwapAsset,
    to: SwapAsset,
    fromAmount: string
  ): Promise<string> {
    const result = await alexSDK.getAmountTo(
      from.currency,
      BigInt(new BigNumber(fromAmount).multipliedBy(oneHundredMillion).dp(0).toString()),
      to.currency
    );
    return new BigNumber(Number(result)).dividedBy(oneHundredMillion).toString();
  }

  return {
    alexSDK,
    fetchToAmount,
    getAssetFromAlexCurrency,
    onSetSwapSubmissionData: (value: SwapSubmissionData) => setSwapSubmissionData(value),
    slippage,
    supportedCurrencies,
    swapSubmissionData,
  };
}
