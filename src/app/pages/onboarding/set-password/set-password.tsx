import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { OnboardingSelectors } from '@tests/selectors/onboarding.selectors';
import { Form, Formik } from 'formik';
import { styled } from 'leather-styles/jsx';
import { debounce } from 'ts-debounce';
import * as yup from 'yup';

import { RouteUrls } from '@shared/route-urls';
import { isUndefined } from '@shared/utils';

import { useFinishAuthRequest } from '@app/common/authentication/use-finish-auth-request';
import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useOnboardingState } from '@app/common/hooks/auth/use-onboarding-state';
import { useKeyActions } from '@app/common/hooks/use-key-actions';
import { useRouteHeader } from '@app/common/hooks/use-route-header';
import {
  blankPasswordValidation,
  validatePassword,
} from '@app/common/validation/validate-password';
import { Header } from '@app/components/header';
import { TwoColumnLayout } from '@app/components/secret-key/two-column.layout';
import { OnboardingGate } from '@app/routes/onboarding-gate';
import { useStacksAccounts } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { Button } from '@app/ui/components/button/button';

import { PasswordField } from './components/password-field';

// Imported dynamically
// ts-unused-exports:disable-next-line
export function SetPasswordRoute() {
  return (
    <OnboardingGate>
      <SetPasswordPage />
    </OnboardingGate>
  );
}

interface SetPasswordFormValues {
  password: string;
  confirmPassword: string;
}
const setPasswordFormValues: SetPasswordFormValues = { password: '', confirmPassword: '' };

function SetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [strengthResult, setStrengthResult] = useState(blankPasswordValidation);
  const stacksAccounts = useStacksAccounts();
  const { setPassword } = useKeyActions();
  const finishSignIn = useFinishAuthRequest();
  const navigate = useNavigate();
  const { decodedAuthRequest } = useOnboardingState();
  const analytics = useAnalytics();

  useRouteHeader(<Header hideActions onClose={() => navigate(-1)} />);

  useEffect(() => {
    void analytics.page('view', '/set-password');
  }, [analytics]);

  const submit = useCallback(
    async (password: string) => {
      await setPassword(password);

      if (decodedAuthRequest) {
        if (!stacksAccounts) return;

        if (stacksAccounts && stacksAccounts.length > 1) {
          navigate(RouteUrls.ChooseAccount);
        } else {
          await finishSignIn(0);
        }
      } else {
        navigate(RouteUrls.Home);
      }
    },
    [setPassword, decodedAuthRequest, stacksAccounts, navigate, finishSignIn]
  );

  const onSubmit = useCallback(
    async ({ password }: SetPasswordFormValues) => {
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
      .required()
      .test({
        message: 'Weak',
        test: debounce((value: unknown) => {
          if (isUndefined(value)) {
            setStrengthResult(blankPasswordValidation);
            return false;
          }
          if (typeof value !== 'string') return false;
          const result = validatePassword(value);
          setStrengthResult(result);
          if (!result.meetsAllStrengthRequirements) {
            void analytics.track('submit_invalid_password');
          }
          return result.meetsAllStrengthRequirements;
        }, 60) as unknown as yup.TestFunction<any, any>,
      }),
  });
  return (
    <Formik
      initialValues={setPasswordFormValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      validateOnBlur
      validateOnMount
      validateOnChange
    >
      {({ dirty, isSubmitting, isValid }) => (
        <Form>
          <TwoColumnLayout
            leftColumn={
              <>
                <styled.h1
                  textStyle={['heading.03', 'heading.03', 'heading.03', 'display.02']}
                  mt="space.00"
                  mb="space.06"
                >
                  Set a password
                </styled.h1>
                <styled.p textStyle={['label.01', 'heading.05']} mb="space.06">
                  Your password protects your Secret Key on this device only.
                </styled.p>
                <styled.p textStyle="body.02" color="ink.10">
                  You'll need just your Secret Key to access your wallet on another device, or this
                  one if you lose your password.
                </styled.p>
              </>
            }
            rightColumn={
              <>
                <styled.h2
                  textStyle="heading.03"
                  mt="space.02"
                  mb="space.04"
                  hideBelow="sm"
                  textAlign="center"
                >
                  Your password
                </styled.h2>
                <PasswordField strengthResult={strengthResult} isDisabled={loading} />
                <Button
                  data-testid={OnboardingSelectors.SetPasswordBtn}
                  disabled={loading || !(dirty && isValid)}
                  aria-busy={loading || isSubmitting}
                  mt="space.08"
                  type="submit"
                >
                  Continue
                </Button>
              </>
            }
          />
        </Form>
      )}
    </Formik>
  );
}
