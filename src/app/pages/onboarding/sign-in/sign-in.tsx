import { ChangeEvent } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import YourSecretKey from '@assets/images/onboarding/your-secret-key.png';
import { Box, Input, Stack, Text, color, useClipboard, useMediaQuery } from '@stacks/ui';
import { OnboardingSelectors } from '@tests/selectors/onboarding.selectors';
import { Form, Formik } from 'formik';

import { RouteUrls } from '@shared/route-urls';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { CenteredPageContainer } from '@app/components/centered-page-container';
import { ErrorLabel } from '@app/components/error-label';
import {
  CENTERED_FULL_PAGE_MAX_WIDTH,
  DESKTOP_VIEWPORT_MIN_WIDTH,
} from '@app/components/global-styles/full-page-styles';
import { Header } from '@app/components/header';
import { Link } from '@app/components/link';
import { PageTitle } from '@app/components/page-title';
import { PrimaryButton } from '@app/components/primary-button';
import { Title } from '@app/components/typography';
import { useSignIn } from '@app/pages/onboarding/sign-in/hooks/use-sign-in';

export function SignIn() {
  const {
    onPaste,
    submitMnemonicForm,
    error,
    isLoading,
    ref,
    onChange,
    toggleKeyMask,
    isKeyMasked,
    sanitizedSecretKey,
  } = useSignIn();
  const navigate = useNavigate();
  const { onCopy } = useClipboard(sanitizedSecretKey);

  const [desktopViewport] = useMediaQuery(`(min-width: ${DESKTOP_VIEWPORT_MIN_WIDTH})`);

  useRouteHeader(<Header onClose={() => navigate(RouteUrls.Onboarding)} hideActions />);

  return (
    <CenteredPageContainer>
      <Formik
        initialValues={{ secretKey: '' }}
        onSubmit={_values => submitMnemonicForm(sanitizedSecretKey)}
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
              {desktopViewport ? (
                <PageTitle>Sign in with your Secret Key</PageTitle>
              ) : (
                <>
                  <Title as="h1">Sign in with Secret Key</Title>
                  <Text color={color('text-caption')}>
                    Enter your 12- or 24-word Secret Key to sign in with an existing wallet
                  </Text>
                </>
              )}
              <Stack spacing="base-tight">
                <Input
                  data-testid={OnboardingSelectors.SecretKeyInput}
                  name="secretKey"
                  as="textarea"
                  autoCapitalize="off"
                  autoFocus
                  borderRadius="10px"
                  fontSize="16px"
                  minHeight="168px"
                  onChange={event => {
                    onChange(event as ChangeEvent<HTMLInputElement>, form.handleChange);
                  }}
                  onKeyDown={e => e.key === 'Enter' && form.submitForm()}
                  onPaste={onPaste}
                  onCopy={onCopy}
                  placeholder="Paste or type your Secret Key"
                  ref={ref as any}
                  spellCheck={false}
                  style={{ resize: 'none' }}
                  value={
                    isKeyMasked ? form.values.secretKey.replace(/[^ ]/g, '*') : sanitizedSecretKey
                  }
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
                <Stack alignItems="center">
                  <Link fontSize="14px" _hover={{ textDecoration: 'none' }} onClick={toggleKeyMask}>
                    <Stack alignItems="center" isInline spacing="tight">
                      {isKeyMasked ? <FiEye /> : <FiEyeOff />}
                      <Text>{isKeyMasked ? 'Show' : 'Hide'} Secret Key</Text>
                    </Stack>
                  </Link>
                </Stack>
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
}
