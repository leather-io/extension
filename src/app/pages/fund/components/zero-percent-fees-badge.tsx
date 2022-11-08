import { FiStar } from 'react-icons/fi';

import { Stack, color } from '@stacks/ui';

import { Caption } from '@app/components/typography';

export function ZeroPercentFeesBadge() {
  return (
    <Stack
      alignItems="center"
      border="1px solid"
      borderColor="#FFE0C2"
      borderRadius="24px"
      color={color('text-caption')}
      height="24px"
      isInline
      justifyContent="center"
      paddingX="tight"
      paddingY="extra-tight"
      spacing="extra-tight"
    >
      <FiStar color="#F59300" size="12px" strokeWidth="2.5px" />
      <Caption color="#FFA953" fontWeight={500} variant="c2">
        0% Fees
      </Caption>
    </Stack>
  );
}
