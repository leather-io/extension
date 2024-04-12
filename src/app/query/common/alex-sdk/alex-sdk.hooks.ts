import { useCallback } from 'react';

import { Currency, type TokenInfo } from 'alex-sdk';
import BigNumber from 'bignumber.js';

import { logger } from '@shared/logger';
import { type MarketData, createMarketData, createMarketPair } from '@shared/models/market.model';
import { type Money, createMoney } from '@shared/models/money.model';
import { isDefined } from '@shared/utils';

import { sortAssetsByName } from '@app/common/asset-utils';
import { useStxBalance } from '@app/common/hooks/balance/stx/use-stx-balance';
import { convertAmountToFractionalUnit } from '@app/common/money/calculate-money';
import { pullContractIdFromIdentity } from '@app/common/utils';
import { useTransferableStacksFungibleTokenAssetBalances } from '@app/query/stacks/balance/stacks-ft-balances.hooks';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { getAvatarFallback } from '@app/ui/components/avatar/avatar';

import { useAlexSdkLatestPricesQuery } from './alex-sdk-latest-prices.query';
import { useAlexSdkSwappableCurrencyQuery } from './alex-sdk-swappable-currency.query';

export interface SwapAsset {
  address?: string;
  balance: Money;
  currency: Currency;
  displayName?: string;
  fallback: string;
  icon: string;
  name: string;
  marketData: MarketData | null;
  principal: string;
}

export const defaultSwapFee = createMoney(1000000, 'STX');

export function useAlexCurrencyPriceAsMarketData() {
  const { data: supportedCurrencies = [] } = useAlexSdkSwappableCurrencyQuery();
  const { data: prices } = useAlexSdkLatestPricesQuery();

  return useCallback(
    (principal: string, symbol?: string) => {
      const tokenInfo = supportedCurrencies
        .filter(isDefined)
        .find(token => pullContractIdFromIdentity(token.contractAddress) === principal);
      if (!symbol || !prices || !tokenInfo) {
        logger.error('Could not create market data');
        return null;
      }
      const currency = tokenInfo.id as Currency;
      const price = convertAmountToFractionalUnit(new BigNumber(prices[currency] ?? 0), 2);
      return createMarketData(createMarketPair(symbol, 'USD'), createMoney(price, 'USD'));
    },
    [prices, supportedCurrencies]
  );
}

function useMakeSwapAsset() {
  const account = useCurrentStacksAccount();
  const { data: prices } = useAlexSdkLatestPricesQuery();
  const priceAsMarketData = useAlexCurrencyPriceAsMarketData();
  const { availableBalance: availableStxBalance } = useStxBalance();
  const stacksFtAssetBalances = useTransferableStacksFungibleTokenAssetBalances(
    account?.address ?? ''
  );

  return useCallback(
    (tokenInfo?: TokenInfo): SwapAsset | undefined => {
      if (!prices) return;
      if (!tokenInfo) {
        logger.error('No token data found to swap');
        return;
      }

      const currency = tokenInfo.id as Currency;
      const fungibleTokenBalance = stacksFtAssetBalances.find(
        balance => tokenInfo.contractAddress === balance.asset.contractId
      )?.balance;
      const principal = pullContractIdFromIdentity(tokenInfo.contractAddress);

      const swapAsset = {
        currency,
        fallback: getAvatarFallback(tokenInfo.name),
        icon: tokenInfo.icon,
        name: tokenInfo.name,
        principal: pullContractIdFromIdentity(tokenInfo.contractAddress),
      };

      if (currency === Currency.STX) {
        return {
          ...swapAsset,
          balance: availableStxBalance,
          displayName: 'Stacks',
          marketData: priceAsMarketData(principal, availableStxBalance.symbol),
        };
      }

      return {
        ...swapAsset,
        balance: fungibleTokenBalance ?? createMoney(0, tokenInfo.name, tokenInfo.decimals),
        marketData: fungibleTokenBalance
          ? priceAsMarketData(principal, fungibleTokenBalance.symbol)
          : priceAsMarketData(principal, tokenInfo.name),
      };
    },
    [availableStxBalance, priceAsMarketData, prices, stacksFtAssetBalances]
  );
}

export function useAlexSwappableAssets() {
  const makeSwapAsset = useMakeSwapAsset();
  return useAlexSdkSwappableCurrencyQuery({
    select: resp => sortAssetsByName(resp.map(makeSwapAsset).filter(isDefined)),
  });
}
