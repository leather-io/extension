import { FiEyeOff, FiLock, FiRotateCcw } from 'react-icons/fi';

import { Box, Stack, color } from '@stacks/ui';
import { OnboardingSelectors } from '@tests/selectors/onboarding.selectors';

import { PrimaryButton } from '@app/components/primary-button';
import { Caption } from '@app/components/typography';

interface BackUpSecretKeyLayoutProps {
  onBackedUpSecretKey(): void;
}
export function BackUpSecretKeyActions(props: BackUpSecretKeyLayoutProps): React.JSX.Element {
  const { onBackedUpSecretKey } = props;

  return (
    <>
      <Stack alignItems="center" isInline>
        <Box as={FiRotateCcw} color={color('text-caption')} size="12px" />
        <Caption>Your Secret Key gives access to your account</Caption>
      </Stack>
      <Stack alignItems="center" isInline>
        <Box as={FiEyeOff} color={color('text-caption')} size="12px" />
        <Caption>Never share your Secret Key</Caption>
      </Stack>
      <Stack alignItems="center" isInline>
        <Box as={FiLock} color={color('text-caption')} size="12px" />
        <Caption>Put it somewhere private and secure</Caption>
      </Stack>

      <PrimaryButton
        data-testid={OnboardingSelectors.BackUpSecretKeyBtn}
        onClick={onBackedUpSecretKey}
        width="170px"
      >
        I've backed it up
      </PrimaryButton>
    </>
  );
}
