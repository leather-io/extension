import { HStack, Stack, styled } from 'leather-styles/jsx';

import { ArrowUpIcon } from '@app/components/icons/arrow-up-icon';
import { Flag } from '@app/components/layout/flag';

interface SwapStatusItemLayoutProps {
  icon: React.JSX.Element;
  text: string;
  timestamp?: string;
}
export function SwapStatusItemLayout({ icon, text, timestamp }: SwapStatusItemLayoutProps) {
  return (
    <Flag align="middle" img={icon} py="tight" spacing="base">
      <HStack alignItems="center" justifyContent="space-between">
        <Stack gap="space.01">
          {timestamp ? <styled.span textStyle="label.01">{timestamp}</styled.span> : null}
          <styled.span textStyle="caption.01">{text}</styled.span>
        </Stack>
        <ArrowUpIcon transform="rotate(45)" />
      </HStack>
    </Flag>
  );
}
