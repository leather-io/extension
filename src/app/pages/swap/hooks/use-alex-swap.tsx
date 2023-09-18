import { useCallback, useState } from 'react';
import { useAsync } from 'react-async-hook';

import { AlexSDK, Currency, TokenInfo } from 'alex-sdk';
import BigNumber from 'bignumber.js';

import { logger } from '@shared/logger';
import { createMoney } from '@shared/models/money.model';

import { useAllTransferableCryptoAssetBalances } from '@app/common/hooks/use-transferable-asset-balances.hooks';
import { convertAmountToFractionalUnit } from '@app/common/money/calculate-money';
import { useSwappableCurrencyQuery } from '@app/query/common/alex-swaps/swappable-currency.query';

import { SwapSubmissionData } from '../swap.context';
import { SwapAsset } from './use-swap-form';

export const oneHundredMillion = 100_000_000;

export function useAlexSwap() {
  const alexSDK = useState(() => new AlexSDK())[0];
  const [swapSubmissionData, setSwapSubmissionData] = useState<SwapSubmissionData>();
  const [slippage, _setSlippage] = useState(0.04);
  const allTransferableCryptoAssetBalances = useAllTransferableCryptoAssetBalances();
  const { data: supportedCurrencies = [] } = useSwappableCurrencyQuery(alexSDK);
  const { result: prices } = useAsync(async () => await alexSDK.getLatestPrices(), [alexSDK]);

  const getAssetFromAlexCurrency = useCallback(
    (tokenInfo?: TokenInfo) => {
      if (!prices) return;
      if (!tokenInfo) {
        logger.error('No token data found to swap');
        return;
      }

      const currency = tokenInfo.id as Currency;
      const price = convertAmountToFractionalUnit(new BigNumber(prices[currency] ?? 0), 2);

      if (currency === Currency.STX) {
        const balance =
          allTransferableCryptoAssetBalances.find(
            x =>
              x.type === 'crypto-currency' && x.blockchain === 'stacks' && x.asset.symbol === 'STX'
          )?.balance ?? createMoney(0, tokenInfo.name, tokenInfo.decimals);

        return {
          balance: balance,
          currency,
          icon: tokenInfo.icon,
          name: tokenInfo.name,
          price: createMoney(price, 'USD'),
        };
      }

      const balance =
        allTransferableCryptoAssetBalances.find(
          x =>
            x.type === 'fungible-token' && alexSDK.getAddressFrom(currency) === x.asset.contractId
        )?.balance ?? createMoney(0, tokenInfo.name, tokenInfo.decimals);

      return {
        balance: balance,
        currency,
        icon: tokenInfo.icon,
        name: tokenInfo.name,
        price: createMoney(price, 'USD'),
      };
    },
    [alexSDK, allTransferableCryptoAssetBalances, prices]
  );

  async function fetchToAmount(
    from: SwapAsset,
    to: SwapAsset,
    fromAmount: string
  ): Promise<string> {
    const amount = new BigNumber(fromAmount).multipliedBy(oneHundredMillion).dp(0).toString();
    const amountAsBigInt = isNaN(Number(amount)) ? BigInt(0) : BigInt(amount);
    const result = await alexSDK.getAmountTo(from.currency, amountAsBigInt, to.currency);
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
