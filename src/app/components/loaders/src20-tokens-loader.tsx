import { useSrc20TokensByAddress } from '@app/query/bitcoin/stamps/stamps-by-address.hooks';
import type { Src20Token } from '@app/query/bitcoin/stamps/stamps-by-address.query';

interface Src20TokensLoaderProps {
  address: string;
  children(src20Tokens: Src20Token[]): React.ReactNode;
}
export function Src20TokensLoader({ address, children }: Src20TokensLoaderProps) {
  const { data: src20Tokens = [] } = useSrc20TokensByAddress(address);
  return children(src20Tokens);
}
