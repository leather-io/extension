import { useNavigate } from 'react-router-dom';
import { Text, Input, Stack, color } from '@stacks/ui';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { isFullPage } from '@app/common/utils';
import { ErrorLabel } from '@app/components/error-label';
import { Header } from '@app/components/header';
import { PrimaryButton } from '@app/components/primary-button';
import { Caption } from '@app/components/typography';
import { useSignIn } from '@app/pages/onboarding/sign-in/hooks/use-sign-in';
import { fullPageContent, fullPageText } from '@app/pages/pages.styles';
import { RouteUrls } from '@shared/route-urls';
import { OnboardingSelectors } from '@tests/integration/onboarding.selectors';

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
    <Stack
      as="form"
      className={isFullPage ? fullPageContent : undefined}
      onSubmit={onSubmit}
      spacing="loose"
      width="100%"
    >
      <Caption className={isFullPage ? fullPageText : undefined}>
        Enter your 12 or 24 word Secret Key to continue.
      </Caption>
      {error && (
        <ErrorLabel lineHeight="16px">
          <Text
            data-testid="sign-in-seed-error"
            color={color('feedback-error')}
            textAlign="left"
            textStyle="caption"
          >
            {error}
          </Text>
        </ErrorLabel>
      )}
      <Input
        as="textarea"
        autoCapitalize="off"
        autoFocus
        borderRadius="10px"
        fontSize="16px"
        minHeight="140px"
        onChange={onChange}
        onKeyDown={onKeyDown as any}
        onPaste={onPaste}
        placeholder="Paste or type your Secret Key"
        ref={ref as any}
        spellCheck={false}
        style={{ resize: 'none' }}
        value={value}
        width="100%"
      />
      <PrimaryButton
        data-testid={OnboardingSelectors.SignInBtn}
        isDisabled={isLoading}
        isLoading={isLoading}
      >
        Continue
      </PrimaryButton>
    </Stack>
  );
};
