import { FiInfo } from 'react-icons/fi';

import { Box, Stack, Text, Tooltip, color } from '@stacks/ui';

import { SpaceBetween } from '@app/components/layout/space-between';

interface SwapDetail {
  title: string;
  tooltipLabel?: string;
  value: string;
}
export function SwapDetail({ title, tooltipLabel, value }: SwapDetail) {
  return (
    <SpaceBetween ml="base" width="100%">
      <Stack alignItems="center" isInline spacing="extra-tight">
        <Text color={color('text-caption')}>{title}</Text>
        {tooltipLabel ? (
          <Tooltip label={tooltipLabel} maxWidth="160px" placement="bottom">
            <Stack>
              <Box
                _hover={{ cursor: 'pointer' }}
                as={FiInfo}
                color={color('text-caption')}
                ml="2px"
                size="16px"
              />
            </Stack>
          </Tooltip>
        ) : null}
      </Stack>
      <Text fontWeight={500}>{value}</Text>
    </SpaceBetween>
  );
}
