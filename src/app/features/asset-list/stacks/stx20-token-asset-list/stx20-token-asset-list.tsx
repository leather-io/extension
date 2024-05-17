import type { Stx20Token } from '@app/query/stacks/stacks-client';

import { Stx20TokenAssetItemLayout } from './stx20-token-asset-item.layout';

interface Stx20TokenAssetListProps {
  tokens: Stx20Token[];
}
export function Stx20TokenAssetList({ tokens }: Stx20TokenAssetListProps) {
  return tokens.map((token, i) => (
    <Stx20TokenAssetItemLayout key={`${token.tokenData.ticker}${i}`} token={token} />
  ));
}
