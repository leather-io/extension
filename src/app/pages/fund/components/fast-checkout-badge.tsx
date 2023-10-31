import { FiZap } from 'react-icons/fi';

import { Stack, color } from '@stacks/ui';

import { Caption } from '@app/ui/components/typography/caption';

export function FastCheckoutBadge() {
  return (
    <Stack
      alignItems="center"
      border="1px solid"
      borderColor="#D9EDD4"
      borderRadius="24px"
      color={color('text-caption')}
      height="24px"
      isInline
      justifyContent="center"
      paddingX="tight"
      paddingY="extra-tight"
      spacing="extra-tight"
    >
      <FiZap color="#008051" size="12px" strokeWidth="2.5px" />
      <Caption color="#008051" fontWeight={500}>
        Fast checkout
      </Caption>
    </Stack>
  );
}
