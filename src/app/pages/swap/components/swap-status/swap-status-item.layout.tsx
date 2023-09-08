import { Stack, styled } from 'leather-styles/jsx';

import { ArrowUpIcon } from '@app/components/icons/arrow-up-icon';
import { Flag } from '@app/components/layout/flag';
import { SpaceBetween } from '@app/components/layout/space-between';

interface SwapStatusItemLayoutProps {
  icon: React.JSX.Element;
  text: string;
  timestamp?: string;
}
export function SwapStatusItemLayout({ icon, text, timestamp }: SwapStatusItemLayoutProps) {
  return (
    <Flag align="middle" img={icon} py="space.02" spacing="space.04">
      <SpaceBetween>
        <Stack gap="space.01">
          {timestamp ? <styled.span fontWeight={500}>{timestamp}</styled.span> : null}
          <styled.span>{text}</styled.span>
        </Stack>
        <ArrowUpIcon transform="rotate(45)" />
      </SpaceBetween>
    </Flag>
  );
}
