import React, { memo } from 'react';
import { Text, Button, Input, Stack, StackProps } from '@stacks/ui';

import { useRouteHeader } from '@common/hooks/use-route-header';
import { useMagicRecoveryCode } from '@common/hooks/auth/use-magic-recovery-code';
import { useMountEffect } from '@common/hooks/use-mount-effect';
import { ErrorLabel } from '@components/error-label';
import { Caption } from '@components/typography';
import { Header } from '@components/header';

const Form: React.FC<StackProps> = memo(props => {
  const { onBack, onSubmit, onChange, magicRecoveryCodePassword, error, isLoading } =
    useMagicRecoveryCode();

  // Weird fix for preventing the input from using a value of the last input
  // I think this is related to the routing and should be resolved with.
  // https://github.com/blockstack/stacks-wallet-web/issues/1048
  const mounted = useMountEffect();

  return (
    <Stack as="form" onSubmit={onSubmit} spacing="loose" {...props}>
      <Stack>
        {mounted && (
          <Input
            autoFocus
            type="password"
            placeholder="Your password"
            fontSize="16px"
            autoCapitalize="off"
            spellCheck={false}
            width="100%"
            onChange={onChange}
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
      </Stack>
      <Stack>
        <Button
          width="100%"
          isLoading={isLoading}
          isDisabled={isLoading}
          data-testid="decrypt-recovery-button"
          type="submit"
        >
          Continue
        </Button>
        <Button mode="tertiary" width="100%" isDisabled={isLoading} onClick={onBack}>
          Go back
        </Button>
      </Stack>
    </Stack>
  );
});

export const MagicRecoveryCode: React.FC = memo(() => {
  const { onBack } = useMagicRecoveryCode();

  useRouteHeader(<Header title="Enter your password" onClose={onBack} hideActions />);

  return (
    <>
      <Caption>
        You entered a Magic Recovery Code. Enter the password you set when you first created your
        Blockstack ID.
      </Caption>
      <Form mt="auto" />
    </>
  );
});
