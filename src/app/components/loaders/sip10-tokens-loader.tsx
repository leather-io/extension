import {
  type Sip10CryptoAssetFilter,
  type Sip10TokenAssetDetails,
  useFilteredSip10Tokens,
} from '@leather-wallet/query';

interface Sip10TokensLoaderProps {
  address: string;
  filter: Sip10CryptoAssetFilter;
  children(isLoading: boolean, tokens: Sip10TokenAssetDetails[]): React.ReactNode;
}
export function Sip10TokensLoader({ address, filter, children }: Sip10TokensLoaderProps) {
  const { isInitialLoading, tokens = [] } = useFilteredSip10Tokens({ address, filter });
  return children(isInitialLoading, tokens);
}
