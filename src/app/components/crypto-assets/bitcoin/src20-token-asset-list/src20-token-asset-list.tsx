import type { Src20Token } from '@app/query/bitcoin/stamps/stamps-by-address.query';

import { Src20TokenAssetItemLayout } from './src20-token-asset-item.layout';

interface Src20TokenAssetListProps {
  src20Tokens: Src20Token[];
}
export function Src20TokenAssetList({ src20Tokens }: Src20TokenAssetListProps) {
  return src20Tokens.map((token, i) => (
    <Src20TokenAssetItemLayout key={`${token.id}${i}`} token={token} />
  ));
}
