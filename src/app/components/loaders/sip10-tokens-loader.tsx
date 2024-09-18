import { type Sip10CryptoAssetFilter, type Sip10TokenAssetDetails } from '@leather.io/query';

import { useCombinedFilteredSip10Tokens } from '@app/common/hooks/use-filtered-sip10-tokens';

interface Sip10TokensLoaderProps {
  address: string;
  filter: Sip10CryptoAssetFilter;
  children(isLoading: boolean, tokens: Sip10TokenAssetDetails[]): React.ReactNode;
}
export function Sip10TokensLoader({ address, filter, children }: Sip10TokensLoaderProps) {
  const { isLoading, tokens = [] } = useCombinedFilteredSip10Tokens({ address, filter });
  return children(isLoading, tokens);
}
