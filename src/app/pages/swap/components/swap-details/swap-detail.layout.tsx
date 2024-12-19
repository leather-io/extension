import { ReactNode } from 'react';

import { Box, HStack, styled } from 'leather-styles/jsx';

import { InfoCircleIcon } from '@leather.io/ui';

import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { BasicTooltip } from '@app/ui/components/tooltip/basic-tooltip';

interface SwapDetailLayoutProps {
  dataTestId?: string;
  moreInfoUrl?: string;
  title: string;
  tooltipLabel?: string;
  value: ReactNode;
}
export function SwapDetailLayout({
  dataTestId,
  moreInfoUrl,
  title,
  tooltipLabel,
  value,
}: SwapDetailLayoutProps) {
  return (
    <HStack alignItems="center" justifyContent="space-between" width="100%">
      <HStack alignItems="center" gap="space.01">
        <styled.span color="ink.text-subdued" textStyle="body.02">
          {title}
        </styled.span>
        {tooltipLabel ? (
          <BasicTooltip label={tooltipLabel} side="bottom">
            <Box _hover={{ cursor: 'pointer' }} color="ink.text-subdued">
              <InfoCircleIcon variant="small" />
            </Box>
          </BasicTooltip>
        ) : null}
        {moreInfoUrl ? (
          <styled.button onClick={() => openInNewTab(moreInfoUrl)} type="button">
            <InfoCircleIcon variant="small" />
          </styled.button>
        ) : null}
      </HStack>
      <styled.span data-testid={dataTestId} textStyle="label.02">
        {value}
      </styled.span>
    </HStack>
  );
}
