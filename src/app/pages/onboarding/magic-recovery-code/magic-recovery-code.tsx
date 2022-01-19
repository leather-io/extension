import { memo } from 'react';
import { Text, Input, Stack } from '@stacks/ui';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { useMagicRecoveryCode } from '@app/common/hooks/auth/use-magic-recovery-code';
import { useMountEffect } from '@app/common/hooks/use-mount-effect';
import { ErrorLabel } from '@app/components/error-label';
import { Caption } from '@app/components/typography';
import { Header } from '@app/components/header';
import { PrimaryButton } from '@app/components/primary-button';
import { CenteredPageContainer } from '@app/components/centered-page-container';
import { FULL_PAGE_MAX_WIDTH } from '@shared/styles-constants';

export const MagicRecoveryCode = memo(() => {
  const { onBack, onSubmit, onChange, magicRecoveryCodePassword, error, isLoading } =
    useMagicRecoveryCode();

  useRouteHeader(<Header title="Enter your password" onClose={onBack} hideActions />);

  // Weird fix for preventing the input from using a value of the last input
  // I think this is related to the routing and should be resolved with.
  // https://github.com/blockstack/stacks-wallet-web/issues/1048
  const mounted = useMountEffect();

  return (
    <CenteredPageContainer>
      <Stack as="form" maxWidth={`${FULL_PAGE_MAX_WIDTH}px`} onSubmit={onSubmit} spacing="loose">
        <Caption textAlign={['left', 'center']}>
          You entered a Magic Recovery Code. Enter the password you set when you first created your
          Blockstack ID.
        </Caption>
        {mounted && (
          <Input
            autoCapitalize="off"
            autoFocus
            borderRadius="10px"
            height="64px"
            onChange={onChange}
            placeholder="Enter your password"
            spellCheck={false}
            type="password"
            width="100%"
            value={magicRecoveryCodePassword}
          />
        )}
        {error && (
          <ErrorLabel lineHeight="16px">
            <Text
              textAlign="left"
              textStyle="caption"
              color="feedback.error"
              data-testid="sign-in-seed-error"
            >
              {error}
            </Text>
          </ErrorLabel>
        )}
        <PrimaryButton
          data-testid="decrypt-recovery-button"
          isDisabled={isLoading}
          isLoading={isLoading}
          width="100%"
        >
          Continue
        </PrimaryButton>
      </Stack>
    </CenteredPageContainer>
  );
});
