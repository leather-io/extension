import { useState, useCallback, useEffect } from 'react';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'ts-debounce';
import { Box, Button, Input, Stack } from '@stacks/ui';
import { Form, Formik } from 'formik';
import * as yup from 'yup';

import { useRouteHeader } from '@common/hooks/use-route-header';
import { useAnalytics } from '@common/hooks/analytics/use-analytics';
import { useWallet } from '@common/hooks/use-wallet';
import { useOnboardingState } from '@common/hooks/auth/use-onboarding-state';
import { HUMAN_REACTION_DEBOUNCE_TIME } from '@common/constants';
import { validatePassword, blankPasswordValidation } from '@common/validation/validate-password';
import { Body, Caption } from '@components/typography';
import { Header } from '@components/header';
import { RouteUrls } from '@routes/route-urls';

interface SetPasswordProps {
  placeholder?: string;
}
export const SetPasswordPage: React.FC<SetPasswordProps> = ({ placeholder }) => {
  const [loading, setLoading] = useState(false);
  const [strengthResult, setStrengthResult] = useState(blankPasswordValidation);
  const { finishSignIn, setPassword, wallet } = useWallet();
  const navigate = useNavigate();
  const { decodedAuthRequest } = useOnboardingState();
  const analytics = useAnalytics();

  useRouteHeader(
    <Header hideActions onClose={() => navigate(RouteUrls.SaveSecretKey)} title="Set a password" />
  );

  useEffect(() => {
    void analytics.page('view', '/set-password');
  }, [analytics]);

  const submit = useCallback(
    async (password: string) => {
      if (!wallet) throw 'Please log in before setting a password.';

      setLoading(true);
      await setPassword(password);

      if (decodedAuthRequest) {
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
    [navigate, decodedAuthRequest, finishSignIn, setPassword, wallet]
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
        message: 'Use a stronger password',
        test: debounce((value: unknown) => {
          if (typeof value !== 'string') return false;
          const result = validatePassword(value);
          setStrengthResult(result);
          if (!result.meetsAllStrengthRequirements) {
            void analytics.track('submit_invalid_password');
          }
          return result.meetsAllStrengthRequirements;
        }, HUMAN_REACTION_DEBOUNCE_TIME),
      }),
  });

  return (
    <Formik
      initialValues={{ password: '' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {formik => (
        <Form>
          <Body className="onboarding-text">
            This password is for this device only. To access your account on a new device you will
            use your Secret Key.
          </Body>
          {formik.submitCount && !strengthResult.meetsAllStrengthRequirements ? (
            <Caption className="onboarding-text" fontSize={0} mt="base-loose">
              Please use a stronger password before continuing. Longer than 12 characters, with
              symbols, numbers, and words.
            </Caption>
          ) : null}
          <Box mt="loose">
            <Stack spacing="loose" width="100%">
              <Input
                name="password"
                placeholder={placeholder || 'Set a password'}
                key="password-input"
                width="100%"
                type="password"
                data-testid="set-password"
                autoFocus
                value={formik.values.password}
                onChange={formik.handleChange}
              />
              <Button
                type="submit"
                width="100%"
                isLoading={loading || formik.isSubmitting}
                isDisabled={loading}
                data-testid="set-password-done"
                borderRadius="10px"
              >
                Done
              </Button>
            </Stack>
          </Box>
        </Form>
      )}
    </Formik>
  );
};
