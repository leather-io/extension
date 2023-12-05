import type { Blockchains } from '@shared/models/blockchain.model';

import { StxAvatar } from '@app/components/crypto-assets/stacks/components/stx-avatar';
import { BtcIcon } from '@app/ui/components/icons/btc-icon';

export function CryptoCurrencyAssetIcon(props: { blockchain: Blockchains }) {
  switch (props.blockchain) {
    case 'bitcoin':
      return <BtcIcon />;
    case 'stacks':
      return <StxAvatar />;
    default:
      return <></>;
  }
}
