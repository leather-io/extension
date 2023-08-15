import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import YourSecretKey from '@assets/images/onboarding/your-secret-key.png';
import { Box, Button, Flex, Grid, Stack, Text, color, useMediaQuery } from '@stacks/ui';
import { OnboardingSelectors } from '@tests/selectors/onboarding.selectors';
import { Form, Formik } from 'formik';

import { RouteUrls } from '@shared/route-urls';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { createNullArrayOfLength } from '@app/common/utils';
import { CenteredPageContainer } from '@app/components/centered-page-container';
import { ErrorLabel } from '@app/components/error-label';
import { DESKTOP_VIEWPORT_MIN_WIDTH } from '@app/components/global-styles/full-page-styles';
import { Header } from '@app/components/header';
import { PageTitle } from '@app/components/page-title';
import { PrimaryButton } from '@app/components/primary-button';
import { Caption, Title } from '@app/components/typography';
import { useSignIn } from '@app/pages/onboarding/sign-in/hooks/use-sign-in';

import { MnemonicWordInput } from './components/mnemonic-word-input';
import { validationSchema } from './utils/mnemonic-validation';

export function SignIn() {
  const { submitMnemonicForm, error, isLoading } = useSignIn();
  const navigate = useNavigate();

  const [twentyFourWordMode, setTwentyFourWordMode] = useState(true);

  const [desktopViewport] = useMediaQuery(`(min-width: ${DESKTOP_VIEWPORT_MIN_WIDTH})`);

  useRouteHeader(<Header onClose={() => navigate(RouteUrls.Onboarding)} hideActions />);

  const [mnemonic, setMnemonic] = useState<(string | null)[]>(() => createNullArrayOfLength(24));

  function mnemonicWordUpdate(index: number, word: string) {
    const newMnemonic = [...mnemonic];
    newMnemonic[index] = word;
    setMnemonic(newMnemonic);
  }

  function updateEntireKey(key: string) {
    const newKey = key.split(' ');
    setMnemonic(newKey);
    void submitMnemonicForm(key);
  }

  const mnemonicFieldArray = createNullArrayOfLength(twentyFourWordMode ? 24 : 12);

  // set initialValues to avoid throwing uncontrolled inputs error
  const initialValues = mnemonicFieldArray.reduce(
    (accumulator, _, index) => ((accumulator[`mnemonic-input-${index}`] = ''), accumulator),
    {}
  );

  return (
    <CenteredPageContainer>
      <Formik
        initialValues={initialValues}
        onSubmit={() => void submitMnemonicForm(mnemonic.join(' '))}
        validationSchema={validationSchema}
        validateOnBlur
        validateOnChange
      >
        <Form>
          <Stack
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
              </>
            )}
            <Box>
              <Text color={color('text-caption')}>
                Enter your Secret Key to sign in with an existing wallet
              </Text>
              <Caption mt="base-tight">
                Tip: You can paste in your entire Secret Key at once
              </Caption>
            </Box>
            <Stack spacing="base-tight">
              <Grid
                mx="base"
                templateColumns={['repeat(2, minmax(30%, 1fr))', 'repeat(3, minmax(120px, 1fr))']}
                rowGap="30px"
                columnGap="30px"
              >
                {mnemonicFieldArray.map((_, i) => (
                  <MnemonicWordInput
                    index={i}
                    key={i}
                    onPasteEntireKey={key => {
                      (document.activeElement as HTMLInputElement).blur();
                      updateEntireKey(key);
                    }}
                    onUpdateWord={w => mnemonicWordUpdate(i, w)}
                  />
                ))}
              </Grid>
            </Stack>
            <Flex flexDirection="column" justifyContent="center" alignItems="center">
              {error && (
                <ErrorLabel mb="loose" alignItems="center">
                  <Text
                    data-testid="sign-in-seed-error"
                    color={color('feedback-error')}
                    pr="extra-loose"
                    textStyle="caption"
                  >
                    {error}
                  </Text>
                </ErrorLabel>
              )}
              <PrimaryButton
                data-testid={OnboardingSelectors.SignInBtn}
                isDisabled={isLoading}
                isLoading={isLoading}
                width="320px"
              >
                Continue
              </PrimaryButton>
              <Button
                mt="loose"
                variant="link"
                textStyle="caption"
                color={color('text-caption')}
                type="button"
                onClick={() => {
                  setTwentyFourWordMode(!twentyFourWordMode);
                  setMnemonic(createNullArrayOfLength(twentyFourWordMode ? 24 : 12));
                }}
              >
                {twentyFourWordMode ? 'Have a 12-word Secret Key?' : 'Use 24 word Secret Key'}
              </Button>
            </Flex>
          </Stack>
        </Form>
      </Formik>
    </CenteredPageContainer>
  );
}
