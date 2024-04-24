import type { Stx20Token } from '@app/api/stacks/types/stx20-types';

import { Stx20TokenAssetItemLayout } from './stx20-token-asset-item.layout';

interface Stx20TokenAssetListProps {
  stx20Tokens: Stx20Token[];
}
export function Stx20TokenAssetList({ stx20Tokens }: Stx20TokenAssetListProps) {
  return stx20Tokens.map((token, i) => (
    <Stx20TokenAssetItemLayout key={`${token.ticker}${i}`} token={token} />
  ));
}
