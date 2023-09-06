import { DashedHr } from '@app/components/hr';
import { CheckmarkIcon } from '@app/components/icons/checkmark-icon';
import { DotIcon } from '@app/components/icons/dot-icon';

import { SwapStatusItemLayout } from './swap-status-item.layout';
import { SwapStatusLayout } from './swap-status.layout';

// TODO: Replace with live data
export function SwapStatus() {
  return (
    <SwapStatusLayout>
      <SwapStatusItemLayout
        icon={<CheckmarkIcon />}
        text="You set up your swap"
        timestamp="Today at 10:14 PM"
      />
      <DashedHr />
      <SwapStatusItemLayout
        icon={<CheckmarkIcon />}
        text="We received your BTC"
        timestamp="Today at 10:14 PM"
      />
      <DashedHr />
      <SwapStatusItemLayout icon={<DotIcon />} text="We escrow your transaction" />
      <DashedHr />
      <SwapStatusItemLayout icon={<DotIcon />} text="We add your xBTC to your balance" />
    </SwapStatusLayout>
  );
}
