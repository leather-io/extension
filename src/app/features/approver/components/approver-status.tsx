import dayjs from 'dayjs';
import { styled } from 'leather-styles/jsx';

import { toLocalizedDateFormat } from '@app/common/date-utils';
import { capitalize } from '@app/common/utils';
import { loadingStripedGradient } from '@app/ui/animations/loading-striped-gradient';
import { BulletSeparator } from '@app/ui/components/bullet-separator/bullet-separator';

type ApproverStatus = 'completed' | 'error' | 'pending';

interface StatusIndicatorLineProps {
  status: ApproverStatus;
}
function StatusIndicatorLine({ status }: StatusIndicatorLineProps) {
  switch (status) {
    case 'pending':
      return <styled.div height="4px" className={loadingStripedGradient} />;
    case 'error':
      return <styled.div height="4px" bg="red.action-primary-default" />;
    case 'completed':
      return <styled.div height="4px" bg="green.action-primary-default" />;
    default:
      return null;
  }
}

interface ApproverStatusProps {
  status: ApproverStatus;
}
export function ApproverStatus({ status }: ApproverStatusProps) {
  return (
    <styled.div pos="relative">
      <StatusIndicatorLine status={status} />
      <styled.div
        textStyle="label.03"
        background="ink.background-primary"
        px="space.05"
        py="space.03"
      >
        <BulletSeparator spacing="space.02">
          <styled.span>{capitalize(status)}</styled.span>
          <styled.span>{toLocalizedDateFormat(dayjs())}</styled.span>
        </BulletSeparator>
      </styled.div>
    </styled.div>
  );
}
