import type { Sip10CryptoAssetInfo } from '@leather-wallet/models';
import { Stack } from 'leather-styles/jsx';

import type { AssetItem } from '../../asset-list';
import { Sip10TokenAssetItem } from './sip10-token-asset-item';

export interface Sip10AssetItem extends AssetItem {
  assetInfo: Sip10CryptoAssetInfo;
}

interface Sip10TokenAssetListProps {
  tokens: Sip10AssetItem[];
  onClick?(symbol: string, contractId?: string): void;
}
export function Sip10TokenAssetList({ tokens, onClick }: Sip10TokenAssetListProps) {
  if (!tokens.length) return null;

  return (
    <Stack>
      {tokens.map(token => (
        <Sip10TokenAssetItem
          assetInfo={token.assetInfo}
          balance={token.balance}
          key={token.assetInfo.name}
          marketData={token.marketData}
          onClick={onClick}
        />
      ))}
    </Stack>
  );
}
