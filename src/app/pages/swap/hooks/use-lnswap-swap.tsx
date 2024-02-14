import { useCallback, useState } from 'react';
import { useAsync } from 'react-async-hook';

import { AlexSDK, Currency, TokenInfo } from 'lnswap-sdk';
import BigNumber from 'bignumber.js';

import { logger } from '@shared/logger';
import { createMoney } from '@shared/models/money.model';

import { useStxBalance } from '@app/common/hooks/balance/stx/use-stx-balance';
import { convertAmountToFractionalUnit } from '@app/common/money/calculate-money';
import { pullContractIdFromIdentity } from '@app/common/utils';
// TODO: change this
import { useSwappableCurrencyQuery } from '@app/query/common/lnswap-swaps/swappable-currency.query';
import { useTransferableStacksFungibleTokenAssetBalances } from '@app/query/stacks/balance/stacks-ft-balances.hooks';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { SwapSubmissionData } from '../swap.context';
import { SwapAsset } from './use-swap-form';

export const oneHundredMillion = 100_000_000;

export function useLNSwapSwap() {
  const alexSDK = useState(() => new AlexSDK())[0];
  const [swapSubmissionData, setSwapSubmissionData] = useState<SwapSubmissionData>();
  const [slippage, _setSlippage] = useState(0.04);
  const [isFetchingExchangeRate, setIsFetchingExchangeRate] = useState(false);
  const { data: supportedCurrencies = [] } = useSwappableCurrencyQuery(alexSDK);
  console.log('30.hooks/use-lnswap-swap.tsx', supportedCurrencies);
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
      console.log('49.hooks/use-lnswap-swap.tsx', tokenInfo.id, currency);
      const price = convertAmountToFractionalUnit(new BigNumber(prices[currency] ?? 0), 2);
      const swapAsset = {
        currency,
        icon: tokenInfo.icon,
        name: tokenInfo.name,
        price: createMoney(price, 'USD'),
        principal: 'pullContractIdFromIdentity(tokenInfo.contractAddress)',
      };
      console.log('58.hooks/use-lnswap-swap.tsx', swapAsset);
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
      console.log('70.hooks/use-lnswap-swap.tsx', fungibleTokenBalance);
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
    console.log('84.fetchToAmount', from, to, fromAmount);
    fromAmount = Math.floor(Number(fromAmount)).toString();
    const amount = new BigNumber(fromAmount).multipliedBy(oneHundredMillion).dp(0).toString();
    const amountAsBigInt = isNaN(Number(amount)) ? BigInt(0) : BigInt(amount);
    console.log('86.fetchToAmount', from, to, amountAsBigInt);
    try {
      setIsFetchingExchangeRate(true);
      const result = await alexSDK.getAmountTo(from.currency, amountAsBigInt, to.currency);
      setIsFetchingExchangeRate(false);
      console.log('91.setIsFetchingExchangeRate', result);
      return new BigNumber(Number(result)).dividedBy(oneHundredMillion).toString();
    } catch (e) {
      logger.error('Error fetching exchange rate from LNSwap', e);
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
