import { FiCheck } from 'react-icons/fi';
import { color, Stack } from '@stacks/ui';

import { Caption } from '@app/components/typography';
import { OnboardingSelectors } from '@tests/integration/onboarding/onboarding.selectors';

export function StepDoneBadge() {
  return (
    <Stack
      alignItems="center"
      data-testid={OnboardingSelectors.StepItemDone}
      border="2px solid"
      borderColor={color('bg-4')}
      borderRadius="25px"
      color={color('text-caption')}
      height="24px"
      isInline
      justifyContent="center"
      maxWidth="62px"
      paddingX="tight"
      paddingY="extra-tight"
      spacing="extra-tight"
    >
      <FiCheck />
      <Caption fontWeight={400} variant="c2">
        Done
      </Caption>
    </Stack>
  );
}
