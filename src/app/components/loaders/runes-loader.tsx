import type {
  BaseCryptoAssetBalance,
  CryptoAssetBalance,
  RuneCryptoAssetInfo,
} from '@leather.io/models';
import { useRuneTokens } from '@leather.io/query';

import { type AssetFilter, filterTokens } from '@app/common/utils';

interface rune {
  balance: BaseCryptoAssetBalance;
  info: RuneCryptoAssetInfo;
}
[];
interface RunesLoaderProps {
  addresses: string[];
  children(runes: { balance: CryptoAssetBalance; info: RuneCryptoAssetInfo }[]): React.ReactNode;
  filter?: AssetFilter;
}
export function RunesLoader({ addresses, children, filter = 'all' }: RunesLoaderProps) {
  const { runes = [] } = useRuneTokens(addresses);
  const getTokenIdentifier = (token: rune) => token.info.spacedRuneName;
  const filteredTokens = filterTokens({ tokens: runes, filter, getTokenIdentifier });
  return children(filteredTokens);
}
