import { type ReactNode, useEffect } from 'react';

import { Stack } from 'leather-styles/jsx';

import { type Sip10TokenAssetDetails, useAlexCurrencyPriceAsMarketData } from '@leather.io/query';

import { getPrincipalFromContractId } from '@app/common/utils';

import { Sip10TokenAssetItem } from './sip10-token-asset-item';

interface Sip10TokenAssetListProps {
  isLoading: boolean;
  tokens: Sip10TokenAssetDetails[];
  onSelectAsset?(symbol: string, contractId?: string): void;
  showBalance?: boolean;
  renderRightElement?(id: string): ReactNode;
}
export function Sip10TokenAssetList({
  isLoading,
  tokens,
  onSelectAsset,
  showBalance = true,
  renderRightElement,
}: Sip10TokenAssetListProps) {
  const priceAsMarketData = useAlexCurrencyPriceAsMarketData();
  if (!tokens.length) return null;

  return (
    <Stack>
      {tokens.map(token => (
        <Sip10TokenAssetItem
          balance={showBalance ? token.balance : null}
          key={token.info.name}
          info={token.info}
          isLoading={isLoading}
          marketData={
            showBalance
              ? priceAsMarketData(
                  getPrincipalFromContractId(token.info.contractId),
                  token.balance.availableBalance.symbol
                )
              : null
          }
          onSelectAsset={onSelectAsset}
          renderRightElement={renderRightElement}
        />
      ))}
    </Stack>
  );
}
