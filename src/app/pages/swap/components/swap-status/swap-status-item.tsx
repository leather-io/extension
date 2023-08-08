import { FiArrowUpRight } from 'react-icons/fi';

import { Stack, Text } from '@stacks/ui';

import { Flag } from '@app/components/layout/flag';
import { SpaceBetween } from '@app/components/layout/space-between';

interface SwapStatusItemProps {
  icon: React.JSX.Element;
  text: string;
  timeStamp?: string;
}
export function SwapStatusItem({ icon, text, timeStamp }: SwapStatusItemProps) {
  return (
    <Flag align="middle" img={icon} py="tight" spacing="base">
      <SpaceBetween>
        <Stack spacing="extra-tight">
          {timeStamp ? <Text fontWeight={500}>{timeStamp}</Text> : null}
          <Text>{text}</Text>
        </Stack>
        <FiArrowUpRight size="20px" />
      </SpaceBetween>
    </Flag>
  );
}
