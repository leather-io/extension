import type {
  BaseCryptoAssetBalance,
  CryptoAssetBalance,
  RuneCryptoAssetInfo,
} from '@leather.io/models';
import { useRuneTokens } from '@leather.io/query';

import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { useAllTokens } from '@app/store/manage-tokens/manage-tokens.slice';
import { filterTokens, type AssetFilter } from '@app/common/filter-tokens';

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
  const accountIndex = useCurrentAccountIndex();
  const allTokens = useAllTokens();
  const getTokenIdentifier = (token: rune) => token.info.spacedRuneName;
  const filteredTokens = filterTokens({
    tokens: runes,
    accountIndex,
    allTokens,
    filter,
    getTokenIdentifier,
  });
  return children(filteredTokens);
}
