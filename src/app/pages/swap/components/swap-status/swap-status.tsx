import { FiCheck, FiCircle } from 'react-icons/fi';

import { Box } from '@stacks/ui';

import { Hr } from '@app/components/hr';

import { SwapStatusItemLayout } from './swap-status-item.layout';
import { SwapStatusLayout } from './swap-status.layout';

function PendingDot() {
  return <Box as={FiCircle} fill="#42444E" size="8px" width="20px" />;
}

function SuccessCheck() {
  return <Box as={FiCheck} size="20px" />;
}

// TODO: Replace with live data
export function SwapStatus() {
  return (
    <SwapStatusLayout>
      <SwapStatusItemLayout
        icon={<SuccessCheck />}
        text="You set up your swap"
        timestamp="Today at 10:14 PM"
      />
      <Hr />
      <SwapStatusItemLayout
        icon={<SuccessCheck />}
        text="We received your BTC"
        timestamp="Today at 10:14 PM"
      />
      <Hr />
      <SwapStatusItemLayout icon={<PendingDot />} text="We escrow your transaction" />
      <Hr />
      <SwapStatusItemLayout icon={<PendingDot />} text="We add your xBTC to your balance" />
    </SwapStatusLayout>
  );
}
