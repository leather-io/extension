import { FiArrowUpRight } from 'react-icons/fi';

import { Stack, Text } from '@stacks/ui';

import { Flag } from '@app/components/layout/flag';
import { SpaceBetween } from '@app/components/layout/space-between';

interface SwapStatusItemLayoutProps {
  icon: React.JSX.Element;
  text: string;
  timestamp?: string;
}
export function SwapStatusItemLayout({ icon, text, timestamp }: SwapStatusItemLayoutProps) {
  return (
    <Flag align="middle" img={icon} py="tight" spacing="base">
      <SpaceBetween>
        <Stack spacing="extra-tight">
          {timestamp ? <Text fontWeight={500}>{timestamp}</Text> : null}
          <Text>{text}</Text>
        </Stack>
        <FiArrowUpRight size="20px" />
      </SpaceBetween>
    </Flag>
  );
}
