import { useNavigate } from 'react-router-dom';
import { Text, Input, Stack, color, Box } from '@stacks/ui';
import { Form, Formik } from 'formik';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { isFullPage } from '@app/common/utils';
import { ErrorLabel } from '@app/components/error-label';
import { Header } from '@app/components/header';
import { CenteredPageContainer } from '@app/components/centered-page-container';
import { PrimaryButton } from '@app/components/primary-button';
import { useSignIn } from '@app/pages/onboarding/sign-in/hooks/use-sign-in';
import YourSecretKey from '@assets/images/onboarding/your-secret-key.png';
import { RouteUrls } from '@shared/route-urls';
import { OnboardingSelectors } from '@tests/integration/onboarding/onboarding.selectors';
import { PageTitle } from '@app/components/page-title';
import { Title } from '@app/components/typography';
import { CENTERED_FULL_PAGE_MAX_WIDTH } from '@app/components/global-styles/full-page-styles';

export const SignIn = () => {
  const { onPaste, submitMnemonicForm, error, isLoading, ref } = useSignIn();
  const navigate = useNavigate();

  useRouteHeader(<Header onClose={() => navigate(RouteUrls.Onboarding)} hideActions />);

  return (
    <CenteredPageContainer>
      <Formik
        initialValues={{ secretKey: '' }}
        onSubmit={values => submitMnemonicForm(values.secretKey)}
      >
        {form => (
          <Form>
            <Stack
              maxWidth={CENTERED_FULL_PAGE_MAX_WIDTH}
              px={['loose', 'base-loose']}
              spacing={['loose', 'extra-loose']}
              textAlign={['left', 'center']}
            >
              <Box alignSelf={['start', 'center']} width={['81px', '101px']}>
                <img src={YourSecretKey} />
              </Box>
              {isFullPage ? (
                <PageTitle>Sign in with your Secret Key</PageTitle>
              ) : (
                <>
                  <Title as="h1">Sign in with Secret Key</Title>
                  <Text color={color('text-caption')}>
                    Enter your 12- or 24-word Secret Key to sign in to Stacks Wallet with an
                    existing account
                  </Text>
                </>
              )}
              <Stack spacing="base-tight">
                <Input
                  name="secretKey"
                  as="textarea"
                  autoCapitalize="off"
                  autoFocus
                  borderRadius="10px"
                  fontSize="16px"
                  minHeight="168px"
                  onChange={form.handleChange}
                  onKeyDown={e => e.key === 'Enter' && form.submitForm()}
                  onPaste={onPaste}
                  placeholder="Paste or type your Secret Key"
                  ref={ref as any}
                  spellCheck={false}
                  style={{ resize: 'none' }}
                  value={form.values.secretKey}
                  width="100%"
                />
                {error && (
                  <ErrorLabel>
                    <Text
                      data-testid="sign-in-seed-error"
                      color={color('feedback-error')}
                      maxWidth="340px"
                      pr="extra-loose"
                      textAlign="left"
                      textStyle="caption"
                    >
                      {error}
                    </Text>
                  </ErrorLabel>
                )}
              </Stack>
              <PrimaryButton
                data-testid={OnboardingSelectors.SignInBtn}
                isDisabled={isLoading}
                isLoading={isLoading}
              >
                Continue
              </PrimaryButton>
            </Stack>
          </Form>
        )}
      </Formik>
    </CenteredPageContainer>
  );
};
