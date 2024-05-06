import { type Src20Token, useSrc20TokensByAddress } from '@leather-wallet/query';

interface Src20TokensLoaderProps {
  address: string;
  children(tokens: Src20Token[]): React.ReactNode;
}
export function Src20TokensLoader({ address, children }: Src20TokensLoaderProps) {
  const { data: tokens = [] } = useSrc20TokensByAddress(address);
  return children(tokens);
}
