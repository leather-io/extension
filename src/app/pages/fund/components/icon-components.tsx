import ReceiveFundsEllipses from '@assets/images/fund/receive-funds-ellipses.png';
import { BtcAvatarIcon, StxAvatarIcon } from '@leather-wallet/ui';
import { Box } from 'leather-styles/jsx';

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
