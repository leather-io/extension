import { FiCheck } from 'react-icons/fi';
import { Box, color, Stack } from '@stacks/ui';

import { Caption } from '@app/components/typography';
import { OnboardingSelectors } from '@tests/integration/onboarding/onboarding.selectors';

export function StepDoneBadge() {
  return (
    <Box
      data-testid={OnboardingSelectors.StepItemDone}
      border="2px solid"
      borderColor={color('bg-4')}
      borderRadius="25px"
      color={color('text-caption')}
      height="24px"
      width="62px"
    >
      <Stack
        alignItems="center"
        height="100%"
        isInline
        justifyContent="center"
        spacing="extra-tight"
      >
        <FiCheck />
        <Caption fontWeight={400} variant="c2">
          Done
        </Caption>
      </Stack>
    </Box>
  );
}
