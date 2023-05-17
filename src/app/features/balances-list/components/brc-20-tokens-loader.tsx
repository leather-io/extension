import {
  Brc20Token,
  useBrc20TokensByAddressQuery,
} from '@app/query/bitcoin/ordinals/brc20-tokens.query';
import { useCurrentBtcTaprootAccountAddressIndexZeroPayment } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';

interface Brc20TokensLoaderProps {
  children(brc20Tokens: Brc20Token[]): JSX.Element;
}
export function Brc20TokensLoader({ children }: Brc20TokensLoaderProps) {
  const { address: bitcoinAddressTaproot } = useCurrentBtcTaprootAccountAddressIndexZeroPayment();
  const { data: brc20Tokens } = useBrc20TokensByAddressQuery(bitcoinAddressTaproot);
  if (!bitcoinAddressTaproot || !brc20Tokens || !brc20Tokens.result) return null;
  return children(brc20Tokens.result.list);
}
