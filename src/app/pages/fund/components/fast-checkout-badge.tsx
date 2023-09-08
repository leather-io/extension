import { FiZap } from 'react-icons/fi';

import { HStack } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { Caption } from '@app/components/typography';

export function FastCheckoutBadge() {
  return (
    <HStack
      alignItems="center"
      border="1px solid"
      borderColor="#D9EDD4"
      borderRadius="24px"
      color={token('colors.accent.text-subdued')}
      height="24px"
      justifyContent="center"
      paddingX="space.02"
      paddingY="space.01"
      gap="space.01"
    >
      <FiZap color="#008051" size="12px" strokeWidth="2.5px" />
      <Caption color="#008051" fontWeight={500} variant="c2">
        Fast checkout
      </Caption>
    </HStack>
  );
}
