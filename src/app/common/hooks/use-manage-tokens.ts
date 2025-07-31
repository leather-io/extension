import {
  useConfigSbtc,
  useConfigTokensEnabledByDefault,
} from '@app/query/common/remote-config/remote-config.query';
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
  const configEnabledTokens = useConfigTokensEnabledByDefault();
  const { contractId: sbtcContractId, isSbtcEnabled } = useConfigSbtc();

  const userTokensList = useUserAllTokens();

  function isTokenEnabled({ tokenId, preEnabledTokensIds }: IsTokenEnabledArgs) {
    const token = userTokensList.find(t => t.id === tokenId);
    const isEnabledByDefault =
      configEnabledTokens.includes(tokenId) || preEnabledTokensIds?.includes(tokenId);

    return token?.enabled ?? isEnabledByDefault;
  }

  function sortTokens(tokens: any[]) {
    return tokens.sort((a, b) => {
      if (a.asset?.contractId === sbtcContractId) return -1;
      if (b.asset?.contractId === sbtcContractId) return 1;
      return 0;
    });
  }

  function filterTokens<T>({
    tokens,
    filter = 'all',
    getTokenId,
    preEnabledTokensIds,
  }: FilterTokensArgs<T>): T[] {
    if (filter === 'all') return tokens;

    const sortedTokens = isSbtcEnabled ? sortTokens(tokens) : tokens;

    return sortedTokens.filter(t => {
      const tokenId = getTokenId(t);
      const tokenEnabled = isTokenEnabled({ tokenId, preEnabledTokensIds });

      return filter === 'enabled' ? tokenEnabled : !tokenEnabled;
    });
  }

  return { isTokenEnabled, filterTokens };
}
