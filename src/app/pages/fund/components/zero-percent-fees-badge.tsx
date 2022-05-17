import { FiStar } from 'react-icons/fi';

import { Box, color, Stack } from '@stacks/ui';
import { Caption } from '@app/components/typography';

export function ZeroPercentFeesBadge() {
  return (
    <Box
      border="1px solid"
      borderColor="#FFE0C2"
      borderRadius="24px"
      color={color('text-caption')}
      height="24px"
      paddingX="tight"
      paddingY="extra-tight"
    >
      <Stack
        alignItems="center"
        height="100%"
        isInline
        justifyContent="center"
        spacing="extra-tight"
      >
        <FiStar color="#F59300" size="12px" strokeWidth="2.5px" />
        <Caption color="#FFA953" fontWeight={500} variant="c2">
          0% Fees
        </Caption>
      </Stack>
    </Box>
  );
}
