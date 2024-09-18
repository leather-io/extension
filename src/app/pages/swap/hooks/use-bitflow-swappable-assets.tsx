import { useCallback } from 'react';

import { useQuery } from '@tanstack/react-query';
import { Currency } from 'alex-sdk';
import BigNumber from 'bignumber.js';
import type { Token } from 'bitflow-sdk';

import { createMarketData, createMarketPair } from '@leather.io/models';
import {
  type SwapAsset,
  useAlexCurrencyPriceAsMarketData,
  useAlexSdkLatestPricesQuery,
  useStxAvailableUnlockedBalance,
  useTransferableSip10Tokens,
} from '@leather.io/query';
import {
  convertAmountToFractionalUnit,
  createMoney,
  getPrincipalFromContractId,
  isDefined,
} from '@leather.io/utils';

import { createGetBitflowAvailableTokensQueryOptions } from '@app/query/bitflow-sdk/bitflow-available-tokens.query';

import { sortSwapAssets } from '../swap.utils';

const BITFLOW_STX_CURRENCY: Currency = 'token-stx' as Currency;
const USD_DECIMAL_PRECISION = 2;

function useCreateSwapAsset(address: string) {
  const { data: prices } = useAlexSdkLatestPricesQuery();
  const priceAsMarketData = useAlexCurrencyPriceAsMarketData();
  const availableUnlockedBalance = useStxAvailableUnlockedBalance(address);
  const sip10Tokens = useTransferableSip10Tokens(address);

  return useCallback(
    (token?: Token): SwapAsset | undefined => {
      if (!prices || !token || !token.tokenContract) return;

      const swapAsset = {
        currency: token.tokenId as Currency,
        fallback: token.symbol.slice(0, 2),
        icon: token.icon,
        name: token.symbol,
        displayName: token.name,
        principal: token.tokenContract,
      };

      if (token.tokenId === BITFLOW_STX_CURRENCY) {
        const price = convertAmountToFractionalUnit(
          new BigNumber(prices[Currency.STX] ?? 0),
          USD_DECIMAL_PRECISION
        );
        return {
          ...swapAsset,
          balance: availableUnlockedBalance,
          displayName: 'Stacks',
          marketData: createMarketData(
            createMarketPair(availableUnlockedBalance.symbol, 'USD'),
            createMoney(price, 'USD')
          ),
        };
      }

      const availableBalance = sip10Tokens.find(
        sip10Token => getPrincipalFromContractId(sip10Token.info.contractId) === token.tokenContract
      )?.balance.availableBalance;

      return {
        ...swapAsset,
        balance: availableBalance ?? createMoney(0, token.symbol, token.tokenDecimals),
        marketData: availableBalance
          ? priceAsMarketData(swapAsset.principal, availableBalance.symbol)
          : priceAsMarketData(swapAsset.principal, token.symbol),
      };
    },
    [availableUnlockedBalance, priceAsMarketData, prices, sip10Tokens]
  );
}

export function useBitflowSwappableAssets(address: string) {
  const createSwapAsset = useCreateSwapAsset(address);
  return useQuery({
    ...createGetBitflowAvailableTokensQueryOptions(),
    select: resp => sortSwapAssets(resp.map(createSwapAsset).filter(isDefined)),
  });
}
