import { ReactNode } from 'react';

import { Box, HStack, styled } from 'leather-styles/jsx';

import { InfoIcon } from '@app/ui/components/icons/info-icon';
import { BasicTooltip } from '@app/ui/components/tooltip/basic-tooltip';

interface SwapDetailLayoutProps {
  dataTestId?: string;
  title: string;
  tooltipLabel?: string;
  value: ReactNode;
}
export function SwapDetailLayout({
  dataTestId,
  title,
  tooltipLabel,
  value,
}: SwapDetailLayoutProps) {
  return (
    <HStack alignItems="center" justifyContent="space-between" width="100%">
      <HStack alignItems="center" gap="space.01">
        <styled.span color="accent.text-subdued" textStyle="body.02">
          {title}
        </styled.span>
        {tooltipLabel ? (
          <BasicTooltip label={tooltipLabel} side="bottom">
            <Box _hover={{ cursor: 'pointer' }} color="accent.text-subdued">
              <InfoIcon />
            </Box>
          </BasicTooltip>
        ) : null}
      </HStack>
      <styled.span data-testid={dataTestId} fontWeight={500} textStyle="label.02">
        {value}
      </styled.span>
    </HStack>
  );
}
