import { Stack } from 'leather-styles/jsx';

import { getPrincipalFromContractId } from '@app/common/utils';
import { useAlexCurrencyPriceAsMarketData } from '@app/query/common/alex-sdk/alex-sdk.hooks';
import type { Sip10TokenAssetDetails } from '@app/query/stacks/sip10/sip10-tokens.hooks';

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
          key={token.info.name}
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
