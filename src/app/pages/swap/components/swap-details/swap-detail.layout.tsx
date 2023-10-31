import { ReactNode } from 'react';

import { Box, HStack, styled } from 'leather-styles/jsx';

import { Tooltip } from '@app/components/tooltip';
import { InfoIcon } from '@app/ui/components/icons/info-icon';

interface SwapDetailLayoutProps {
  title: string;
  tooltipLabel?: string;
  value: ReactNode;
}
export function SwapDetailLayout({ title, tooltipLabel, value }: SwapDetailLayoutProps) {
  return (
    <HStack alignItems="center" justifyContent="space-between" width="100%">
      <HStack alignItems="center" gap="space.01">
        <styled.span color="accent.text-subdued" textStyle="body.02">
          {title}
        </styled.span>
        {tooltipLabel ? (
          <Tooltip label={tooltipLabel} maxWidth="160px" placement="bottom">
            <Box _hover={{ cursor: 'pointer' }} color="accent.text-subdued">
              <InfoIcon />
            </Box>
          </Tooltip>
        ) : null}
      </HStack>
      <styled.span fontWeight={500} textStyle="label.02">
        {value}
      </styled.span>
    </HStack>
  );
}
