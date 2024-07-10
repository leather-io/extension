import { Stack } from 'leather-styles/jsx';

import { type Sip10TokenAssetDetails, useAlexCurrencyPriceAsMarketData } from '@leather.io/query';

import { getPrincipalFromContractId } from '@app/common/utils';

import { Sip10TokenAssetItem } from './sip10-token-asset-item';

interface Sip10TokenAssetListProps {
  isLoading: boolean;
  tokens: Sip10TokenAssetDetails[];
  onSelectAsset?(symbol: string, contractId?: string): void;
}
export function Sip10TokenAssetList({
  isLoading,
  tokens,
  onSelectAsset,
}: Sip10TokenAssetListProps) {
  const priceAsMarketData = useAlexCurrencyPriceAsMarketData();

  if (!tokens.length) return null;

  return (
    <Stack>
      {tokens.map(token => (
        <Sip10TokenAssetItem
          balance={token.balance}
          key={token.info.name + token.info.contractId}
          info={token.info}
          isLoading={isLoading}
          marketData={priceAsMarketData(
            getPrincipalFromContractId(token.info.contractId),
            token.balance.availableBalance.symbol
          )}
          onSelectAsset={onSelectAsset}
        />
      ))}
    </Stack>
  );
}
