import dayjs from 'dayjs';
import { styled } from 'leather-styles/jsx';

import { BulletSeparator } from '@app/ui/components/bullet-separator/bullet-separator';

interface ApproverStatusProps {
  status: 'completed' | 'error' | 'pending';
}
export function ApproverStatus({ status }: ApproverStatusProps) {
  return (
    <styled.div>
      <BulletSeparator>
        {status}
        <styled.span>{dayjs(new Date()).format()}</styled.span>
      </BulletSeparator>
    </styled.div>
  );
}
