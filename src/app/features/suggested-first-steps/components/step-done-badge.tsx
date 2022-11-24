import { FiCheck } from 'react-icons/fi';

import { Stack, color } from '@stacks/ui';
import { OnboardingSelectors } from '@tests-legacy/integration/onboarding/onboarding.selectors';

import { Caption } from '@app/components/typography';

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
