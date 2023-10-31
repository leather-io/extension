import QRCodeIcon from '@assets/images/fund/qr-code-icon.png';
import ReceiveStxEllipses from '@assets/images/fund/receive-stx-ellipses.png';
import StacksIcon from '@assets/images/fund/stacks-icon.png';
import { FundPageSelectors } from '@tests/selectors/fund.selectors';
import { Box } from 'leather-styles/jsx';

import { FundAccountTile } from './fund-account-tile';

const description = 'Receive STX from a friend or deposit from a separate wallet';
const StxIconWithEllipses = (
  <>
    <Box>
      <img src={StacksIcon} width="40px" />
    </Box>
    <Box>
      <img src={ReceiveStxEllipses} width="24px" />
    </Box>
  </>
);
interface ReceiveStxItemProps {
  onReceiveStx(): void;
}
export function ReceiveStxItem({ onReceiveStx }: ReceiveStxItemProps) {
  return (
    <FundAccountTile
      description={description}
      icon={QRCodeIcon}
      onClickTile={onReceiveStx}
      receiveStxIcon={StxIconWithEllipses}
      testId={FundPageSelectors.BtnReceiveStx}
    />
  );
}
