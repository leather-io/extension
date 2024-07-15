import { useEffect } from 'react';

import { type Sip10TokenAssetDetails } from '@leather.io/query';

import type { RightElementVariant } from '@app/common/asset-list-utils';

import { Sip10TokenAssetItem } from './sip10-token-asset-item';

interface Sip10TokenAssetListProps {
  isLoading: boolean;
  tokens: Sip10TokenAssetDetails[];
  onSelectAsset?(symbol: string, contractId?: string): void;
  hasTokenSetter?(tokensLength: number): void;
  rightElementVariant: RightElementVariant;
}

export function Sip10TokenAssetList({
  isLoading,
  tokens,
  onSelectAsset,
  hasTokenSetter,
  rightElementVariant,
}: Sip10TokenAssetListProps) {
  useEffect(() => {
    if (hasTokenSetter) hasTokenSetter(tokens.length);
  }, [tokens.length, hasTokenSetter]);

  if (!tokens.length) return null;

  return tokens.map(token => (
    <Sip10TokenAssetItem
      key={token.info.name}
      token={token}
      isLoading={isLoading}
      onSelectAsset={onSelectAsset}
      rightElementVariant={rightElementVariant}
    />
  ));
}
