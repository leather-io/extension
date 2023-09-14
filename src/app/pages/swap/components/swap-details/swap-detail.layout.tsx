import { Box, HStack, styled } from 'leather-styles/jsx';

import { InfoIcon } from '@app/components/icons/info-icon';
import { SpaceBetween } from '@app/components/layout/space-between';
import { Tooltip } from '@app/components/tooltip';

interface SwapDetailLayoutProps {
  title: string;
  tooltipLabel?: string;
  value?: string;
}
export function SwapDetailLayout({ title, tooltipLabel, value }: SwapDetailLayoutProps) {
  return (
    <SpaceBetween ml="base" width="100%">
      <HStack alignItems="center" gap="space.01">
        <styled.span textStyle="caption.01">{title}</styled.span>
        {tooltipLabel ? (
          <Tooltip label={tooltipLabel} maxWidth="160px" placement="bottom">
            <Box _hover={{ cursor: 'pointer' }} color="accent.text-subdued" ml="space.01">
              <InfoIcon />
            </Box>
          </Tooltip>
        ) : null}
      </HStack>
      <styled.span textStyle="label.01">{value}</styled.span>
    </SpaceBetween>
  );
}
