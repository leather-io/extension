import type { CryptoAssetBalance, Src20CryptoAssetInfo } from '@leather-wallet/models';
import { useSrc20TokensByAddress } from '@leather-wallet/query';

export interface Src20TokenAssetDetails {
  balance: CryptoAssetBalance;
  info: Src20CryptoAssetInfo;
}

interface Src20TokensLoaderProps {
  address: string;
  children(tokens: Src20TokenAssetDetails[]): React.ReactNode;
}
export function Src20TokensLoader({ address, children }: Src20TokensLoaderProps) {
  const { data: tokens = [] } = useSrc20TokensByAddress(address);
  return children(tokens);
}
