import React from 'react';
import { Text, Button, Input, Stack, color } from '@stacks/ui';

import { ErrorLabel } from '@components/error-label';
import { ContainerLayout } from '@components/container/container.layout';
import { Caption } from '@components/typography';
import { useSignIn } from '@pages/onboarding/sign-in/use-sign-in';
import { Header } from '@components/header';

export const SignIn: React.FC = () => {
  const { onBack, onKeyDown, onChange, onPaste, onSubmit, value, error, isLoading, ref } =
    useSignIn();

  return (
    <ContainerLayout
      header={<Header title="Continue with your Secret Key" onClose={onBack} hideActions />}
    >
      <Stack spacing="loose">
        <Caption className="onboarding-text">
          Enter your 12 or 24 word Secret Key to continue.
        </Caption>
        <Stack as="form" onSubmit={onSubmit} spacing="loose">
          <Stack spacing="base">
            {error && (
              <ErrorLabel lineHeight="16px">
                <Text
                  textAlign="left"
                  textStyle="caption"
                  color={color('feedback-error')}
                  data-testid="sign-in-seed-error"
                >
                  {error}
                </Text>
              </ErrorLabel>
            )}
            <Input
              autoFocus
              placeholder="Paste or type your Secret Key"
              as="textarea"
              fontSize="16px"
              autoCapitalize="off"
              spellCheck={false}
              width="100%"
              style={{ resize: 'none' }}
              minHeight="140px"
              ref={ref as any}
              onKeyDown={onKeyDown as any} // need to fix type in UI lib
              onPaste={onPaste}
              onChange={onChange}
              value={value}
            />
          </Stack>
          <Button
            width="100%"
            isLoading={isLoading}
            isDisabled={isLoading}
            data-testid="sign-in-key-continue"
            type="submit"
            borderRadius="10px"
          >
            Continue
          </Button>
        </Stack>
      </Stack>
    </ContainerLayout>
  );
};
