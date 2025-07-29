import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import { logger } from '@shared/logger';
import { bitflow } from '@shared/utils/bitflow-sdk';

import type { SwapAsset } from '@app/query/common/alex-sdk/alex-sdk.hooks';

interface ValidPairsCache {
  [tokenId: string]: string[];
}

const validPairsQueryKey = ['bitflow', 'valid-pairs'] as const;

async function fetchValidPairs(tokens: SwapAsset[]): Promise<ValidPairsCache> {
  const validPairsCache: ValidPairsCache = {};

  await Promise.allSettled(
    tokens.map(async token => {
      try {
        if (!token.tokenId) return;

        const possibleTokens = await bitflow.getAllPossibleTokenY(token.tokenId);
        if (Array.isArray(possibleTokens)) {
          validPairsCache[token.tokenId] = possibleTokens;
        }
      } catch (error) {
        logger.error(`Failed to fetch valid pairs for token ${token.tokenId}:`, error);
        validPairsCache[token.tokenId] = [];
      }
    })
  );

  return validPairsCache;
}

interface UseBitflowValidPairsOptions {
  enabled?: boolean;
}

export function useBitflowValidPairs(
  availableTokens: SwapAsset[] = [],
  options: UseBitflowValidPairsOptions = {}
) {
  const { enabled = true } = options;

  const query = useQuery({
    queryKey: [...validPairsQueryKey, availableTokens.length],
    queryFn: () => fetchValidPairs(availableTokens),
    enabled: enabled && availableTokens.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      logger.warn(`Bitflow valid pairs query failed (attempt ${failureCount}):`, error);
      return failureCount < 2;
    },
  });

  const validPairsLookup = useMemo(() => {
    return query.data || {};
  }, [query.data]);

  const getValidQuoteTokensForBase = useMemo(() => {
    return (baseTokenId: string): string[] => {
      return validPairsLookup[baseTokenId] || [];
    };
  }, [validPairsLookup]);

  const getValidBaseTokensForQuote = useMemo(() => {
    return (quoteTokenId: string): string[] => {
      return Object.keys(validPairsLookup).filter(baseTokenId =>
        validPairsLookup[baseTokenId]?.includes(quoteTokenId)
      );
    };
  }, [validPairsLookup]);

  const isValidPair = useMemo(() => {
    return (baseTokenId?: string, quoteTokenId?: string): boolean => {
      if (!baseTokenId || !quoteTokenId) return false;

      const validQuoteTokens = validPairsLookup[baseTokenId];
      return Array.isArray(validQuoteTokens) && validQuoteTokens.includes(quoteTokenId);
    };
  }, [validPairsLookup]);

  const filterValidAssets = useMemo(() => {
    return (
      assets: SwapAsset[],
      selectedTokenId?: string,
      filterType: 'base' | 'quote' = 'quote'
    ): SwapAsset[] => {
      if (!selectedTokenId || query.isError || query.isLoading || !query.data) {
        logger.debug('Bitflow valid pairs: falling back to all assets', {
          selectedTokenId,
          isError: query.isError,
          isLoading: query.isLoading,
          hasData: !!query.data,
        });
        return assets;
      }

      let validTokenIds: string[];

      if (filterType === 'quote') {
        validTokenIds = getValidQuoteTokensForBase(selectedTokenId);
      } else {
        validTokenIds = getValidBaseTokensForQuote(selectedTokenId);
      }

      if (validTokenIds.length === 0) {
        logger.debug('Bitflow valid pairs: no valid pairs found, showing all assets', {
          selectedTokenId,
          filterType,
        });
        return assets;
      }

      const filteredAssets = assets.filter(
        asset => asset.tokenId && validTokenIds.includes(asset.tokenId)
      );

      logger.debug('Bitflow valid pairs: filtered assets', {
        selectedTokenId,
        filterType,
        originalCount: assets.length,
        filteredCount: filteredAssets.length,
        validTokenIds,
      });

      return filteredAssets;
    };
  }, [
    query.isError,
    query.isLoading,
    query.data,
    getValidQuoteTokensForBase,
    getValidBaseTokensForQuote,
  ]);

  return {
    validPairsCache: validPairsLookup,
    getValidQuoteTokensForBase,
    getValidBaseTokensForQuote,
    isValidPair,
    filterValidAssets,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
