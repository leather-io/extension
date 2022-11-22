import { memo } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, Flex, Input, Stack, StackProps, Text } from '@stacks/ui';
import { WalletPageSelectors } from '@tests-legacy/page-objects/wallet.selectors';
import { Form, Formik } from 'formik';

import { RouteUrls } from '@shared/route-urls';

import { useMagicRecoveryCode } from '@app/common/hooks/auth/use-magic-recovery-code';
import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { CenteredPageContainer } from '@app/components/centered-page-container';
import { ErrorLabel } from '@app/components/error-label';
import { Header } from '@app/components/header';
import { Caption } from '@app/components/typography';

const MagicRecoveryCodeForm: React.FC<StackProps> = memo(props => {
  const navigate = useNavigate();
  const { decryptMagicRecoveryCode, error, isLoading } = useMagicRecoveryCode();

  return (
    <Formik
      initialValues={{ password: '' }}
      onSubmit={values => decryptMagicRecoveryCode(values.password)}
    >
      {form => (
        <Form>
          <Stack spacing="loose" {...props}>
            <Stack>
              <Input
                autoFocus
                type="password"
                name="password"
                placeholder="Your password"
                fontSize="16px"
                autoCapitalize="off"
                spellCheck={false}
                width="100%"
                onChange={form.handleChange}
                value={form.values.password}
              />
              {error && (
                <ErrorLabel lineHeight="16px">
                  <Text
                    textAlign="left"
                    textStyle="caption"
                    color="feedback.error"
                    data-testid="sign-in-seed-error"
                  >
                    {error}
                  </Text>
                </ErrorLabel>
              )}
            </Stack>
            <Flex justifyContent="flex-end">
              <Button
                mode="tertiary"
                isDisabled={isLoading}
                mr="base"
                type="button"
                onClick={() => navigate(RouteUrls.SignIn)}
              >
                Go back
              </Button>
              <Button
                isLoading={isLoading}
                isDisabled={isLoading}
                data-testid="decrypt-recovery-button"
                type="submit"
              >
                Continue
              </Button>
            </Flex>
          </Stack>
        </Form>
      )}
    </Formik>
  );
});

export const MagicRecoveryCode: React.FC = memo(() => {
  const navigate = useNavigate();

  useRouteHeader(
    <Header title="Enter your password" onClose={() => navigate(RouteUrls.SignIn)} hideActions />
  );

  return (
    <CenteredPageContainer>
      <Caption
        mb="base"
        textAlign={['left', 'center']}
        data-testid={WalletPageSelectors.MagicRecoveryMessage}
      >
        You entered a Magic Recovery Code. Enter the password you set when you first created your
        Blockstack ID.
      </Caption>
      <MagicRecoveryCodeForm mt="auto" />
    </CenteredPageContainer>
  );
});
