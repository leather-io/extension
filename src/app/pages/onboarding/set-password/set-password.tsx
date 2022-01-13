import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'ts-debounce';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import { Box, color, Input, Stack, Text } from '@stacks/ui';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useWallet } from '@app/common/hooks/use-wallet';
import { useOnboardingState } from '@app/common/hooks/auth/use-onboarding-state';
import {
  validatePassword,
  blankPasswordValidation,
} from '@app/common/validation/validate-password';
import { ErrorLabel } from '@app/components/error-label';
import { PrimaryButton } from '@app/components/primary-button';
import { Caption } from '@app/components/typography';
import { Header } from '@app/components/header';
import { PageTitle } from '@app/components/page-title';
import { CenteredPageContainer } from '@app/components/centered-page-container';
import { CENTERED_FULL_PAGE_MAX_WIDTH } from '@app/components/global-styles/full-page-styles';
import SetPassword from '@assets/images/onboarding/set-password.png';
import { HUMAN_REACTION_DEBOUNCE_TIME } from '@shared/constants';
import { RouteUrls } from '@shared/route-urls';
import { getWalletConfig } from '@shared/utils/wallet-config-helper';
import { OnboardingSelectors } from '@tests/integration/onboarding/onboarding.selectors';

interface SetPasswordFormValues {
  password: string;
  confirmPassword: string;
}
const setPasswordFormValues: SetPasswordFormValues = { password: '', confirmPassword: '' };

export const SetPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [strengthResult, setStrengthResult] = useState(blankPasswordValidation);
  const { finishSignIn, setPassword, wallet } = useWallet();
  const navigate = useNavigate();
  const { decodedAuthRequest } = useOnboardingState();
  const analytics = useAnalytics();

  useRouteHeader(<Header hideActions onClose={() => navigate(RouteUrls.BackUpSecretKey)} />);

  useEffect(() => {
    void analytics.page('view', '/set-password');
  }, [analytics]);

  useEffect(() => {
    // Proactively fetch the gaia wallet config
    if (!wallet) return;
    void getWalletConfig(wallet);
  }, [wallet]);

  const submit = useCallback(
    async (password: string) => {
      setLoading(true);

      await setPassword(password);

      if (decodedAuthRequest) {
        if (!wallet) return;
        const { accounts } = wallet;
        if (accounts && accounts.length > 1) {
          navigate(RouteUrls.ChooseAccount);
        } else {
          await finishSignIn(0);
        }
      } else {
        navigate(RouteUrls.Home);
      }
    },
    [wallet, setPassword, decodedAuthRequest, navigate, finishSignIn]
  );

  const onSubmit = useCallback(
    async ({ password }) => {
      if (!password) return;
      setLoading(true);
      if (strengthResult.meetsAllStrengthRequirements) {
        void analytics.track('submit_valid_password');
        await submit(password);
        return;
      }
      setLoading(false);
    },
    [strengthResult, submit, analytics]
  );

  const validationSchema = yup.object({
    password: yup
      .string()
      .defined()
      .test({
        message: 'Weak',
        test: debounce((value: unknown) => {
          if (typeof value !== 'string') return false;
          const result = validatePassword(value);
          setStrengthResult(result);
          if (!result.meetsAllStrengthRequirements) {
            void analytics.track('submit_invalid_password');
          }
          return result.meetsAllStrengthRequirements;
        }, HUMAN_REACTION_DEBOUNCE_TIME) as unknown as yup.TestFunction<any, any>,
      }),
    confirmPassword: yup
      .string()
      .defined()
      .when('password', {
        is: (val: string | any[]) => (val && val.length > 0 ? true : false),
        then: yup.string().oneOf([yup.ref('password')], 'Passwords must match'),
      }),
  });

  return (
    <CenteredPageContainer>
      <Formik
        initialValues={setPasswordFormValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
        validateOnBlur={false}
        validateOnChange={false}
        validateOnMount={false}
      >
        {formik => (
          <Form>
            <Stack
              maxWidth={CENTERED_FULL_PAGE_MAX_WIDTH}
              mb={['loose', 'unset']}
              px={['loose', 'unset']}
              spacing="loose"
              textAlign={['left', 'center']}
            >
              <Box alignSelf={['start', 'center']} width={['95px', '117px']}>
                <img src={SetPassword} />
              </Box>
              <PageTitle>Set a password</PageTitle>
              <Text lineHeight="1.5rem">
                Your password protects your Secret Key and is for this device only. To access your
                Stacks account on another device or wallet you’ll need just your Secret Key.
                {formik.submitCount &&
                !formik.isSubmitting &&
                !strengthResult.meetsAllStrengthRequirements ? (
                  <Caption fontSize={0} mt="base-loose">
                    Please use a stronger password. Longer than 12 characters, with symbols,
                    numbers, and words.
                  </Caption>
                ) : null}
              </Text>
              <Stack px={['unset', 'base-loose']} spacing="base">
                <Input
                  autoFocus
                  data-testid={OnboardingSelectors.NewPasswordInput}
                  height="64px"
                  key="password-input"
                  name="password"
                  onChange={formik.handleChange}
                  placeholder="Set a password"
                  type="password"
                  value={formik.values.password}
                />
                {formik.submitCount && formik.errors.password ? (
                  <Stack alignItems="center" isInline>
                    <Caption mr="4px !important">Password strength:</Caption>
                    <Caption color={color('feedback-error')}>{formik.errors.password}</Caption>
                  </Stack>
                ) : null}
                <Input
                  data-testid={OnboardingSelectors.ConfirmPasswordInput}
                  height="64px"
                  key="confirm-password-input"
                  name="confirmPassword"
                  onChange={formik.handleChange}
                  placeholder="Confirm password"
                  type="password"
                  value={formik.values.confirmPassword}
                  width="100%"
                />
                {formik.submitCount && formik.errors.confirmPassword ? (
                  <ErrorLabel>
                    <Text textStyle="caption">{formik.errors.confirmPassword}</Text>
                  </ErrorLabel>
                ) : null}
                <PrimaryButton
                  data-testid={OnboardingSelectors.SetPasswordBtn}
                  isDisabled={loading}
                  isLoading={loading || formik.isSubmitting}
                  mt="tight"
                >
                  Done
                </PrimaryButton>
              </Stack>
            </Stack>
          </Form>
        )}
      </Formik>
    </CenteredPageContainer>
  );
};
