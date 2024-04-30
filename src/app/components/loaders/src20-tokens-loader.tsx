import { useSrc20TokensByAddress } from '@app/query/bitcoin/stamps/stamps-by-address.hooks';
import type { Src20Token } from '@app/query/bitcoin/stamps/stamps-by-address.query';

interface Src20TokensLoaderProps {
  address: string;
  children(tokens: Src20Token[]): React.ReactNode;
}
export function Src20TokensLoader({ address, children }: Src20TokensLoaderProps) {
  const { data: tokens = [] } = useSrc20TokensByAddress(address);
  return children(tokens);
}
