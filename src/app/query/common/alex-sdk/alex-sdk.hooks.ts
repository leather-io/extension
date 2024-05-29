import { useCallback } from 'react';

import type { Money } from '@leather-wallet/models';
import { createMoney, isDefined } from '@leather-wallet/utils';
import { Currency, type TokenInfo } from 'alex-sdk';
import BigNumber from 'bignumber.js';

import { logger } from '@shared/logger';
import { type MarketData, createMarketData, createMarketPair } from '@shared/models/market.model';

import { sortAssetsByName } from '@app/common/asset-utils';
import { convertAmountToFractionalUnit } from '@app/common/money/calculate-money';
import { getPrincipalFromContractId } from '@app/common/utils';
import { useCurrentStxAvailableUnlockedBalance } from '@app/query/stacks/balance/account-balance.hooks';
import { useTransferableSip10Tokens } from '@app/query/stacks/sip10/sip10-tokens.hooks';
import { useCurrentStacksAccountAddress } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
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
    (principal: string, symbol: string) => {
      const tokenInfo = supportedCurrencies
        .filter(isDefined)
        .find(token => getPrincipalFromContractId(token.contractAddress) === principal);
      if (!prices || !tokenInfo)
        return createMarketData(createMarketPair(symbol, 'USD'), createMoney(0, 'USD'));
      const currency = tokenInfo.id as Currency;
      const price = convertAmountToFractionalUnit(new BigNumber(prices[currency] ?? 0), 2);
      return createMarketData(createMarketPair(symbol, 'USD'), createMoney(price, 'USD'));
    },
    [prices, supportedCurrencies]
  );
}

function useCreateSwapAsset() {
  const address = useCurrentStacksAccountAddress();
  const { data: prices } = useAlexSdkLatestPricesQuery();
  const priceAsMarketData = useAlexCurrencyPriceAsMarketData();
  const availableUnlockedBalance = useCurrentStxAvailableUnlockedBalance();
  const sip10Tokens = useTransferableSip10Tokens(address);

  return useCallback(
    (tokenInfo?: TokenInfo): SwapAsset | undefined => {
      if (!prices) return;
      if (!tokenInfo) {
        logger.error('No token data found to swap');
        return;
      }

      const currency = tokenInfo.id as Currency;
      const principal = getPrincipalFromContractId(tokenInfo.contractAddress);
      const availableBalance = sip10Tokens.find(token => token.info.contractId === principal)
        ?.balance.availableBalance;

      const swapAsset = {
        currency,
        fallback: getAvatarFallback(tokenInfo.name),
        icon: tokenInfo.icon,
        name: tokenInfo.name,
        principal,
      };

      if (currency === Currency.STX) {
        return {
          ...swapAsset,
          balance: availableUnlockedBalance,
          displayName: 'Stacks',
          marketData: priceAsMarketData(principal, availableUnlockedBalance.symbol),
        };
      }

      return {
        ...swapAsset,
        balance: availableBalance ?? createMoney(0, tokenInfo.name, tokenInfo.decimals),
        marketData: availableBalance
          ? priceAsMarketData(principal, availableBalance.symbol)
          : priceAsMarketData(principal, tokenInfo.name),
      };
    },
    [availableUnlockedBalance, priceAsMarketData, prices, sip10Tokens]
  );
}

export function useAlexSwappableAssets() {
  const createSwapAsset = useCreateSwapAsset();
  return useAlexSdkSwappableCurrencyQuery({
    select: resp => sortAssetsByName(resp.map(createSwapAsset).filter(isDefined)),
  });
}
