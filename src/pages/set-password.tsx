import React, { useState, useCallback, useEffect } from 'react';
import { debounce } from 'ts-debounce';
import { Box, Button, Input, Stack } from '@stacks/ui';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import { PopupContainer } from '@components/popup/container';
import { useChangeScreen } from '@common/hooks/use-change-screen';
import { RouteUrls } from '@routes/route-urls';
import { useWallet } from '@common/hooks/use-wallet';

import { useOnboardingState } from '@common/hooks/auth/use-onboarding-state';

import { HUMAN_REACTION_DEBOUNCE_TIME, USERNAMES_ENABLED } from '@common/constants';
import { validatePassword, blankPasswordValidation } from '@common/validation/validate-password';
import { Body, Caption } from '@components/typography';
import { Header } from '@components/header';
import { useAnalytics } from '@common/hooks/analytics/use-analytics';

interface SetPasswordProps {
  redirect?: boolean;
  accountGate?: boolean;
  placeholder?: string;
}

export const SetPasswordPage: React.FC<SetPasswordProps> = ({
  redirect,
  accountGate,
  placeholder,
}) => {
  const [loading, setLoading] = useState(false);
  const [strengthResult, setStrengthResult] = useState(blankPasswordValidation);
  const { doSetPassword, wallet, doFinishSignIn } = useWallet();
  const doChangeScreen = useChangeScreen();
  const { decodedAuthRequest } = useOnboardingState();
  const analytics = useAnalytics();
  useEffect(() => {
    void analytics.page('view', '/set-password');
  }, [analytics]);

  const submit = useCallback(
    async (password: string) => {
      if (!wallet) throw 'Please log in before setting a password.';
      setLoading(true);
      await doSetPassword(password);
      if (accountGate) return;
      if (decodedAuthRequest) {
        const { accounts } = wallet;
        if (accounts && (accounts.length > 1 || accounts[0].username)) {
          doChangeScreen(RouteUrls.ChooseAccount);
        } else if (!USERNAMES_ENABLED) {
          await doFinishSignIn(0);
        } else {
          doChangeScreen(RouteUrls.Username);
        }
      } else if (redirect) {
        doChangeScreen(RouteUrls.Installed);
      }
    },
    [
      doSetPassword,
      doChangeScreen,
      redirect,
      decodedAuthRequest,
      wallet,
      doFinishSignIn,
      accountGate,
    ]
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
    <PopupContainer header={<Header hideActions title="Set a password" />} requestType="auth">
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
              <Caption fontSize={0} mt="base-loose">
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
    </PopupContainer>
  );
};
