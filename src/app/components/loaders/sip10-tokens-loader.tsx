import {
  type Sip10TokenAssetDetails,
  useFilteredSip10Tokens,
} from '@app/query/stacks/sip10/sip10-tokens.hooks';
import type { Sip10CryptoAssetFilter } from '@app/query/stacks/sip10/sip10-tokens.utils';

interface Sip10TokensLoaderProps {
  address: string;
  filter: Sip10CryptoAssetFilter;
  children(isLoading: boolean, tokens: Sip10TokenAssetDetails[]): React.ReactNode;
}
export function Sip10TokensLoader({ address, filter, children }: Sip10TokensLoaderProps) {
  const { isInitialLoading, tokens = [] } = useFilteredSip10Tokens({ address, filter });
  return children(isInitialLoading, tokens);
}
