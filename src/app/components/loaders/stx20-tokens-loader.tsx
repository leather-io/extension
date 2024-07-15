import type { CryptoAssetBalance, Stx20CryptoAssetInfo } from '@leather.io/models';
import { type Sip10CryptoAssetFilter, useStx20Tokens } from '@leather.io/query';

import { filterTokens } from '@app/common/filter-tokens';
import { type TokenUserSetting } from '@app/store/manage-tokens/manage-tokens.slice';

interface Token {
  balance: CryptoAssetBalance;
  info: Stx20CryptoAssetInfo;
}

interface Stx20TokensLoaderProps {
  address: string;
  filter: Sip10CryptoAssetFilter;
  accountIndex: number;
  userSetTokens: TokenUserSetting[];
  children(tokens: Token[]): React.ReactNode;
}
export function Stx20TokensLoader({
  userSetTokens,
  accountIndex,
  address,
  children,
  filter,
}: Stx20TokensLoaderProps) {
  const { data: tokens = [] } = useStx20Tokens(address);

  const getTokenIdentifier = (token: any) => token.info.symbol;
  const filteredTokens = filterTokens({
    tokens,
    accountIndex,
    userSetTokens,
    filter,
    getTokenIdentifier,
  });
  return children(filteredTokens);
}
