import { useCallback, useState } from 'react';
import { useAsync } from 'react-async-hook';

import { AlexSDK, Currency, TokenInfo } from 'alex-sdk';
import BigNumber from 'bignumber.js';

import { logger } from '@shared/logger';
import { createMoney } from '@shared/models/money.model';

import { useStxBalance } from '@app/common/hooks/balance/stx/use-stx-balance';
import { convertAmountToFractionalUnit } from '@app/common/money/calculate-money';
import { useSwappableCurrencyQuery } from '@app/query/common/alex-swaps/swappable-currency.query';
import { useTransferableStacksFungibleTokenAssetBalances } from '@app/query/stacks/balance/stacks-ft-balances.hooks';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { SwapSubmissionData } from '../swap.context';
import { SwapAsset } from './use-swap-form';

export const oneHundredMillion = 100_000_000;

export function useAlexSwap() {
  const alexSDK = useState(() => new AlexSDK())[0];
  const [swapSubmissionData, setSwapSubmissionData] = useState<SwapSubmissionData>();
  const [slippage, _setSlippage] = useState(0.04);
  const [isFetchingExchangeRate, setIsFetchingExchangeRate] = useState(false);
  const { data: supportedCurrencies = [] } = useSwappableCurrencyQuery(alexSDK);
  const { result: prices } = useAsync(async () => await alexSDK.getLatestPrices(), [alexSDK]);
  const { availableBalance: availableStxBalance } = useStxBalance();
  const account = useCurrentStacksAccount();
  const stacksFtAssetBalances = useTransferableStacksFungibleTokenAssetBalances(
    account?.address ?? ''
  );

  const createSwapAssetFromAlexCurrency = useCallback(
    (tokenInfo?: TokenInfo) => {
      if (!prices) return;
      if (!tokenInfo) {
        logger.error('No token data found to swap');
        return;
      }

      const currency = tokenInfo.id as Currency;
      const price = convertAmountToFractionalUnit(new BigNumber(prices[currency] ?? 0), 2);
      const swapAsset = {
        currency,
        icon: tokenInfo.icon,
        name: tokenInfo.name,
        price: createMoney(price, 'USD'),
      };

      if (currency === Currency.STX) {
        return {
          ...swapAsset,
          balance: availableStxBalance,
        };
      }

      const fungibleTokenBalance =
        stacksFtAssetBalances.find(x => alexSDK.getAddressFrom(currency) === x.asset.contractId)
          ?.balance ?? createMoney(0, tokenInfo.name, tokenInfo.decimals);

      return {
        ...swapAsset,
        balance: fungibleTokenBalance,
      };
    },
    [alexSDK, availableStxBalance, prices, stacksFtAssetBalances]
  );

  async function fetchToAmount(
    from: SwapAsset,
    to: SwapAsset,
    fromAmount: string
  ): Promise<string | undefined> {
    const amount = new BigNumber(fromAmount).multipliedBy(oneHundredMillion).dp(0).toString();
    const amountAsBigInt = isNaN(Number(amount)) ? BigInt(0) : BigInt(amount);
    try {
      setIsFetchingExchangeRate(true);
      const result = await alexSDK.getAmountTo(from.currency, amountAsBigInt, to.currency);
      setIsFetchingExchangeRate(false);
      return new BigNumber(Number(result)).dividedBy(oneHundredMillion).toString();
    } catch (e) {
      logger.error('Error fetching exchange rate from ALEX', e);
      setIsFetchingExchangeRate(false);
      return;
    }
  }

  return {
    alexSDK,
    fetchToAmount,
    createSwapAssetFromAlexCurrency,
    isFetchingExchangeRate,
    onSetIsFetchingExchangeRate: (value: boolean) => setIsFetchingExchangeRate(value),
    onSetSwapSubmissionData: (value: SwapSubmissionData) => setSwapSubmissionData(value),
    slippage,
    supportedCurrencies,
    swapSubmissionData,
  };
}
