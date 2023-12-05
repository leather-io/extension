import ReceiveFundsEllipses from '@assets/images/fund/receive-funds-ellipses.png';
import { Box } from 'leather-styles/jsx';

import { BtcAvatarIcon } from '@app/ui/components/avatar/btc-avatar-icon';
import { StxAvatarIcon } from '@app/ui/components/avatar/stx-avatar-icon';

export function StacksIconComponent() {
  return (
    <>
      <Box>
        <StxAvatarIcon size="xxl" />
      </Box>
      <Box>
        <img src={ReceiveFundsEllipses} width="24px" />
      </Box>
    </>
  );
}

export function BitcoinIconComponent() {
  return (
    <>
      <BtcAvatarIcon size="xxl" />
      <Box>
        <img src={ReceiveFundsEllipses} width="24px" />
      </Box>
    </>
  );
}
