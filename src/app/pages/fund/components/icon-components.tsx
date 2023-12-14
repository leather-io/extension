import BitcoinIcon from '@assets/images/btc-icon.png';
import ReceiveFundsEllipses from '@assets/images/fund/receive-funds-ellipses.png';
import StacksIcon from '@assets/images/fund/stacks-icon.png';
import { Box } from 'leather-styles/jsx';

export function StacksIconComponent() {
  return (
    <>
      <Box>
        <img src={StacksIcon} width="40px" />
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
      <Box>
        <img src={BitcoinIcon} width="40px" />
      </Box>
      <Box>
        <img src={ReceiveFundsEllipses} width="24px" />
      </Box>
    </>
  );
}
