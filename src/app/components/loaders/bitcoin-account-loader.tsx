import { P2Ret } from '@scure/btc-signer/payment';
import type { DistributedOmit } from 'type-fest';

import { BitcoinSigner } from '@leather.io/bitcoin';

import { useConfigBitcoinEnabled } from '@app/query/common/remote-config/remote-config.query';
import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { useNativeSegwitSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useTaprootSigner } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

interface BitcoinAccountLoaderBaseProps {
  children(account: BitcoinSigner<P2Ret>): React.ReactNode;
  fallback?: React.ReactNode;
}
interface BtcAccountLoaderCurrentProps extends BitcoinAccountLoaderBaseProps {
  current: true;
}
interface BtcAccountLoaderIndexProps extends BitcoinAccountLoaderBaseProps {
  index: number;
}

type BtcAccountLoaderProps = BtcAccountLoaderCurrentProps | BtcAccountLoaderIndexProps;

export function useBitcoinNativeSegwitAccountLoader(
  props: DistributedOmit<BtcAccountLoaderProps, 'children' | 'fallback'>
) {
  const isBitcoinEnabled = useConfigBitcoinEnabled();

  const currentAccountIndex = useCurrentAccountIndex();

  const properIndex = 'current' in props ? currentAccountIndex : props.index;

  const signer = useNativeSegwitSigner(properIndex);

  if (!signer || !isBitcoinEnabled) return null;
  return signer(0);
}

export function BitcoinNativeSegwitAccountLoader({
  children,
  fallback,
  ...props
}: BtcAccountLoaderProps) {
  const signer = useBitcoinNativeSegwitAccountLoader(props);
  if (!signer) return fallback;
  return children(signer);
}

export function BitcoinTaprootAccountLoader({ children, ...props }: BtcAccountLoaderProps) {
  const isBitcoinEnabled = useConfigBitcoinEnabled();
  const network = useCurrentNetwork();

  const currentAccountIndex = useCurrentAccountIndex();

  const properIndex = 'current' in props ? currentAccountIndex : props.index;

  const signer = useTaprootSigner(properIndex, network.chain.bitcoin.mode);

  if (!signer || !isBitcoinEnabled) return null;
  return children(signer(0));
}
