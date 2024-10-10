import get from 'lodash.get';

import { useRemoteConfig } from '@leather.io/query';

import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { useUserAllTokens } from '@app/store/manage-tokens/manage-tokens.slice';

interface IsTokenEnabledArgs {
  tokenId: string;
  preEnabledTokensIds: string[];
}
export type AssetFilter = 'all' | 'enabled' | 'disabled';
interface FilterTokensArgs<T> {
  tokens: T[];
  filter: AssetFilter;
  getTokenId(token: T): string;
  preEnabledTokensIds: string[];
}

export function useManageTokens() {
  const config = useRemoteConfig();
  const configEnabledTokens: string[] = get(config, 'tokensEnabledByDefault', []);
  const accountIndex = useCurrentAccountIndex();
  const userTokensList = useUserAllTokens();

  function isTokenEnabled({ tokenId, preEnabledTokensIds }: IsTokenEnabledArgs) {
    const token = userTokensList.find(t => t.accountIndex === accountIndex && t.id === tokenId);
    const isEnabledByDefault =
      configEnabledTokens.includes(tokenId) || preEnabledTokensIds?.includes(tokenId);

    return token?.enabled ?? isEnabledByDefault;
  }

  function filterTokens<T>({
    tokens,
    filter = 'all',
    getTokenId,
    preEnabledTokensIds,
  }: FilterTokensArgs<T>): T[] {
    if (filter === 'all') return tokens;
    return tokens.filter(t => {
      const tokenId = getTokenId(t);

      switch (filter) {
        case 'enabled':
          return isTokenEnabled({ tokenId, preEnabledTokensIds });
        case 'disabled':
          return !isTokenEnabled({ tokenId, preEnabledTokensIds });
        default:
          return true;
      }
    });
  }

  return { isTokenEnabled, filterTokens };
}
