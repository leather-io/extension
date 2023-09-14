import { displayDate, displayTime } from '@app/common/date-utils';
import { CheckmarkIcon } from '@app/components/icons/checkmark-icon';

import { useSwapContext } from '../../swap.context';
import { SwapStatusItemLayout } from './swap-status-item.layout';
import { SwapStatusLayout } from './swap-status.layout';

export function SwapStatus() {
  const { swapSubmissionData } = useSwapContext();

  if (!swapSubmissionData) return null;

  return (
    <SwapStatusLayout>
      <SwapStatusItemLayout
        icon={<CheckmarkIcon />}
        text="You submitted your swap"
        timestamp={`${displayDate(swapSubmissionData.timestamp)} at ${displayTime(
          swapSubmissionData.timestamp
        )}`}
      />
      {/* TODO: Use status updates with future protocols - leaving as examples from designs */}
      {/* <SwapStatusItemLayout
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
      <SwapStatusItemLayout icon={<DotIcon />} text="We add your xBTC to your balance" /> */}
    </SwapStatusLayout>
  );
}
