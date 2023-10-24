import { P2Ret } from '@scure/btc-signer';

import { useConfigBitcoinEnabled } from '@app/query/common/remote-config/remote-config.query';
import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { Signer } from '@app/store/accounts/blockchain/bitcoin/bitcoin-signer';
import { useNativeSegwitSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

interface BitcoinAccountLoaderBaseProps {
  children(account: Signer<P2Ret>): React.ReactNode;
}
interface BtcAccountLoaderCurrentProps extends BitcoinAccountLoaderBaseProps {
  current: true;
}
interface BtcAccountLoaderIndexProps extends BitcoinAccountLoaderBaseProps {
  index: number;
}

type BtcAccountLoaderProps = BtcAccountLoaderCurrentProps | BtcAccountLoaderIndexProps;

export function BitcoinNativeSegwitAccountLoader({ children, ...props }: BtcAccountLoaderProps) {
  const isBitcoinEnabled = useConfigBitcoinEnabled();

  const currentAccountIndex = useCurrentAccountIndex();

  const properIndex = 'current' in props ? currentAccountIndex : props.index;

  const signer = useNativeSegwitSigner(properIndex);

  if (!signer || !isBitcoinEnabled) return null;
  return children(signer(0));
}
