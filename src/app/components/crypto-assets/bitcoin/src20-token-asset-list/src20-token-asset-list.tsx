import type { Src20Token } from '@app/query/bitcoin/stamps/stamps-by-address.query';

import { Src20TokenAssetItemLayout } from './src20-token-asset-item.layout';

interface Src20TokenAssetListProps {
  tokens: Src20Token[];
}
export function Src20TokenAssetList({ tokens }: Src20TokenAssetListProps) {
  return tokens.map((token, i) => (
    <Src20TokenAssetItemLayout key={`${token.id}${i}`} token={token} />
  ));
}
