import { Caption } from '@leather.io/ui';
import { truncateMiddle } from '@leather.io/utils';

import { BitcoinNativeSegwitAccountLoader } from '../loaders/bitcoin-account-loader';

interface AccountBitcoinAddressProps {
  index: number;
}

export function AccountBitcoinAddress({ index }: AccountBitcoinAddressProps) {
  return (
    <BitcoinNativeSegwitAccountLoader index={index}>
      {signer => <Caption>{truncateMiddle(signer.address, 4)}</Caption>}
    </BitcoinNativeSegwitAccountLoader>
  );
}
