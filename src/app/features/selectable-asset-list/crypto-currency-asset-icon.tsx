import type { Blockchains } from '@shared/models/blockchain.model';

import { BtcAvatarIcon } from '@app/ui/components/avatar/btc-avatar-icon';
import { StxAvatarIcon } from '@app/ui/components/avatar/stx-avatar-icon';

export function CryptoCurrencyAssetIcon(props: { blockchain: Blockchains }) {
  switch (props.blockchain) {
    case 'bitcoin':
      return <BtcAvatarIcon />;
    case 'stacks':
      return <StxAvatarIcon />;
    default:
      return <></>;
  }
}
