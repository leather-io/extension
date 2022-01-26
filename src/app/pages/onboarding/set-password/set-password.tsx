import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'ts-debounce';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import { cx } from '@emotion/css';
import { Input, Stack, Text } from '@stacks/ui';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useWallet } from '@app/common/hooks/use-wallet';
import { useOnboardingState } from '@app/common/hooks/auth/use-onboarding-state';
import { isFullPage, isPopup } from '@app/common/utils';
import {
  validatePassword,
  blankPasswordValidation,
} from '@app/common/validation/validate-password';
import { ErrorLabel } from '@app/components/error-label';
import { PrimaryButton } from '@app/components/primary-button';
import { Body, Caption, Title } from '@app/components/typography';
import { Header } from '@app/components/header';
import {
  fullPageContent,
  fullPageText,
  fullPageTitle,
  popupPageTitle,
} from '@app/pages/pages.styles';
import { HUMAN_REACTION_DEBOUNCE_TIME } from '@shared/constants';
import { RouteUrls } from '@shared/route-urls';
import { getWalletConfig } from '@shared/utils/wallet-config-helper';
import { OnboardingSelectors } from '@tests/integration/onboarding.selectors';

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

  const handleSubmit = useCallback(
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
        message: 'Password strength is weak',
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
    <Formik
      initialValues={{ password: '', confirmPassword: '' }}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      validateOnBlur={false}
      validateOnChange={false}
      validateOnMount={false}
    >
      {formik => (
        <Form>
          <Stack className={isFullPage ? fullPageContent : undefined} spacing="loose">
            <Title
              className={cx({ [fullPageTitle]: isFullPage }, { [popupPageTitle]: isPopup })}
              fontWeight={500}
            >
              Set a password
            </Title>
            <Body className={isFullPage ? fullPageText : undefined}>
              Your password protects your Secret Key and is for this device only. To access your
              Stacks account on another device or wallet you’ll need just your Secret Key.
              {formik.submitCount && !strengthResult.meetsAllStrengthRequirements ? (
                <Caption fontSize={0} mt="base-loose">
                  Please use a stronger password. Longer than 12 characters, with symbols, numbers,
                  and words.
                </Caption>
              ) : null}
            </Body>
            <Stack spacing="base">
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
                <ErrorLabel>
                  <Text textStyle="caption">{formik.errors.password}</Text>
                </ErrorLabel>
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
            </Stack>
            <PrimaryButton
              data-testid={OnboardingSelectors.SetPasswordBtn}
              isDisabled={loading}
              isLoading={loading || formik.isSubmitting}
            >
              Done
            </PrimaryButton>
          </Stack>
        </Form>
      )}
    </Formik>
  );
};
