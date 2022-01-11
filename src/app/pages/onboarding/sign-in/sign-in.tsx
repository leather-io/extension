import { useNavigate } from 'react-router-dom';
import { Text, Button, Input, Stack, color } from '@stacks/ui';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { ErrorLabel } from '@app/components/error-label';
import { Caption } from '@app/components/typography';
import { useSignIn } from '@app/pages/onboarding/sign-in/use-sign-in';
import { Header } from '@app/components/header';
import { RouteUrls } from '@shared/route-urls';

export const SignIn = () => {
  const { onKeyDown, onChange, onPaste, onSubmit, value, error, isLoading, ref } = useSignIn();
  const navigate = useNavigate();

  useRouteHeader(
    <Header
      title="Continue with your Secret Key"
      onClose={() => navigate(RouteUrls.Onboarding)}
      hideActions
    />
  );

  return (
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
  );
};
