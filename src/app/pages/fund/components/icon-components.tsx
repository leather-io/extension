import ReceiveFundsEllipses from '@assets/images/fund/receive-funds-ellipses.png';
import { Box } from 'leather-styles/jsx';

import { BtcAvatarIcon, StxAvatarIcon } from '@leather.io/ui';

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
