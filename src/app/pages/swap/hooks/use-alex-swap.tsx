import { useCallback, useState } from 'react';

import { Currency, TokenInfo } from 'alex-sdk';
import BigNumber from 'bignumber.js';

import { logger } from '@shared/logger';
import { createMoney } from '@shared/models/money.model';
import { alex } from '@shared/utils/alex-sdk';

import { useStxBalance } from '@app/common/hooks/balance/stx/use-stx-balance';
import { convertAmountToFractionalUnit } from '@app/common/money/calculate-money';
import { pullContractIdFromIdentity } from '@app/common/utils';
import { useAlexSdkLatestPricesQuery } from '@app/query/common/alex-sdk/latest-prices.query';
import { useAlexSdkSwappableCurrencyQuery } from '@app/query/common/alex-sdk/swappable-currency.query';
import { useTransferableStacksFungibleTokenAssetBalances } from '@app/query/stacks/balance/stacks-ft-balances.hooks';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { SwapSubmissionData } from '../swap.context';
import { SwapAsset } from './use-swap-form';

export const oneHundredMillion = 100_000_000;

export function useAlexSwap() {
  const [swapSubmissionData, setSwapSubmissionData] = useState<SwapSubmissionData>();
  const [slippage, _setSlippage] = useState(0.04);
  const [isFetchingExchangeRate, setIsFetchingExchangeRate] = useState(false);
  const { data: supportedCurrencies = [] } = useAlexSdkSwappableCurrencyQuery();
  const { data: prices } = useAlexSdkLatestPricesQuery();
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
        principal: pullContractIdFromIdentity(tokenInfo.contractAddress),
      };

      if (currency === Currency.STX) {
        return {
          ...swapAsset,
          balance: availableStxBalance,
          displayName: 'Stacks',
        };
      }

      const fungibleTokenBalance =
        stacksFtAssetBalances.find(x => tokenInfo.contractAddress === x.asset.contractId)
          ?.balance ?? createMoney(0, tokenInfo.name, tokenInfo.decimals);

      return {
        ...swapAsset,
        balance: fungibleTokenBalance,
      };
    },
    [availableStxBalance, prices, stacksFtAssetBalances]
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
      const result = await alex.getAmountTo(from.currency, amountAsBigInt, to.currency);
      setIsFetchingExchangeRate(false);
      return new BigNumber(Number(result)).dividedBy(oneHundredMillion).toString();
    } catch (e) {
      logger.error('Error fetching exchange rate from ALEX', e);
      setIsFetchingExchangeRate(false);
      return;
    }
  }

  return {
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
