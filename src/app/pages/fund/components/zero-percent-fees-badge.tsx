import { FiStar } from 'react-icons/fi';

import { HStack } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { Caption } from '@app/components/typography';

export function ZeroPercentFeesBadge() {
  return (
    <HStack
      alignItems="center"
      border="1px solid"
      // #4164 FIXME migrate colour FFE0C2
      borderColor="#FFE0C2"
      borderRadius="24px"
      // #4164 FIXME migrate check text-caption colour
      color={token('colors.accent.text-primary')}
      height="24px"
      justifyContent="center"
      paddingX="space.02"
      paddingY="space.01"
      gap="space.01"
    >
      <FiStar color="#F59300" size="12px" strokeWidth="2.5px" />
      <Caption color="#FFA953" fontWeight={500} variant="c2">
        0% Fees
      </Caption>
    </HStack>
  );
}
