import type {
  BaseCryptoAssetBalance,
  CryptoAssetBalance,
  RuneCryptoAssetInfo,
} from '@leather.io/models';
import { useRuneTokens } from '@leather.io/query';

import { type AssetFilter, filterTokens } from '@app/common/filter-tokens';
import { type TokenUserSetting } from '@app/store/manage-tokens/manage-tokens.slice';

interface rune {
  balance: BaseCryptoAssetBalance;
  info: RuneCryptoAssetInfo;
}
[];
interface RunesLoaderProps {
  addresses: string[];
  accountIndex: number;
  userSetTokens: TokenUserSetting[];
  children(runes: { balance: CryptoAssetBalance; info: RuneCryptoAssetInfo }[]): React.ReactNode;
  filter?: AssetFilter;
}
export function RunesLoader({
  addresses,
  children,
  filter = 'all',
  accountIndex,
  userSetTokens,
}: RunesLoaderProps) {
  const { runes = [] } = useRuneTokens(addresses);
  const getTokenIdentifier = (token: rune) => token.info.spacedRuneName;
  const filteredTokens = runes
    ? filterTokens({
        tokens: runes,
        accountIndex,
        userSetTokens,
        filter,
        getTokenIdentifier,
      })
    : [];
  return children(filteredTokens);
}
