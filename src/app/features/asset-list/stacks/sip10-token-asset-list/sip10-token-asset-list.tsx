import { type Dispatch, type SetStateAction, useEffect } from 'react';

import { Stack } from 'leather-styles/jsx';

import { type Sip10TokenAssetDetails } from '@leather.io/query';

import { useSip10FiatMarketData } from '@app/common/hooks/use-calculate-sip10-fiat-value';

import type { AssetRightElementVariant } from '../../asset-list';
import { Sip10TokenAssetItem } from './sip10-token-asset-item';

interface Sip10TokenAssetListProps {
  isLoading: boolean;
  tokens: Sip10TokenAssetDetails[];
  assetRightElementVariant?: AssetRightElementVariant;
  onSelectAsset?(symbol: string, contractId?: string): void;
  preEnabledTokensIds: string[];
  setHasManageableTokens?: Dispatch<SetStateAction<boolean>>;
}
export function Sip10TokenAssetList({
  isLoading,
  tokens,
  onSelectAsset,
  assetRightElementVariant,
  preEnabledTokensIds,
  setHasManageableTokens,
}: Sip10TokenAssetListProps) {
  const { getTokenMarketData } = useSip10FiatMarketData();

  useEffect(() => {
    if (tokens.length > 0 && setHasManageableTokens) {
      setHasManageableTokens(true);
    }
  }, [tokens, setHasManageableTokens]);

  if (!tokens.length) return null;

  return (
    <Stack>
      {tokens.map(token => (
        <Sip10TokenAssetItem
          assetRightElementVariant={assetRightElementVariant}
          balance={token.balance}
          key={token.info.name + token.info.contractId}
          info={token.info}
          isLoading={isLoading}
          marketData={getTokenMarketData(
            token.info.contractId,
            token.balance.availableBalance.symbol
          )}
          onSelectAsset={onSelectAsset}
          preEnabledTokensIds={preEnabledTokensIds}
        />
      ))}
    </Stack>
  );
}
