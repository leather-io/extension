import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import YourSecretKey from '@assets/images/onboarding/your-secret-key.png';
import { Box, Button, Flex, Grid, Input, Stack, Text, color, useMediaQuery } from '@stacks/ui';
import { OnboardingSelectors } from '@tests/selectors/onboarding.selectors';
import { useFocus } from 'use-events';

import { RouteUrls } from '@shared/route-urls';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { createNullArrayOfLength, extractPhraseFromString } from '@app/common/utils';
import { CenteredPageContainer } from '@app/components/centered-page-container';
import { ErrorLabel } from '@app/components/error-label';
import { DESKTOP_VIEWPORT_MIN_WIDTH } from '@app/components/global-styles/full-page-styles';
import { Header } from '@app/components/header';
import { PageTitle } from '@app/components/page-title';
import { PrimaryButton } from '@app/components/primary-button';
import { Caption, Title } from '@app/components/typography';
import { useSignIn } from '@app/pages/onboarding/sign-in/hooks/use-sign-in';

interface MnemonicWordInputProps {
  index: number;
  value: string;
  onUpdateWord(word: string): void;
  onPasteEntireKey(word: string): void;
}
function MnemonicWordInput({
  index,
  value,
  onUpdateWord,
  onPasteEntireKey,
}: MnemonicWordInputProps) {
  const [isFocused, bind] = useFocus();

  return (
    <Box
      position="relative"
      _after={{
        content: `"${index + 1}."`,
        textAlign: 'right',
        position: 'absolute',
        top: 0,
        left: '-22px',
        lineHeight: '48px',
        color: color('text-caption'),
        fontSize: '12px',
        width: '18px',
      }}
    >
      <Input
        type={isFocused ? 'text' : 'password'}
        value={value}
        autoCapitalize="off"
        spellCheck={false}
        autoComplete="off"
        data-testid={`mnemonic-input-${index}`}
        onPaste={e => {
          const pasteValue = extractPhraseFromString(e.clipboardData.getData('text'));
          if (pasteValue.includes(' ')) {
            e.preventDefault();
            //assume its a full key
            onPasteEntireKey(pasteValue);
          }
        }}
        onChange={(e: any) => {
          e.preventDefault();
          onUpdateWord(e.target.value);
        }}
        {...bind}
      />
    </Box>
  );
}

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

  return (
    <CenteredPageContainer>
      <Stack
        as="form"
        onSubmit={e => {
          e.preventDefault();
          void submitMnemonicForm(mnemonic.join(' '));
        }}
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
          <Caption mt="base-tight">Tip: You can paste in your entire Secret Key at once</Caption>
        </Box>
        <Stack spacing="base-tight">
          <Grid
            mx="base"
            templateColumns={['repeat(2, minmax(30%, 1fr))', 'repeat(3, minmax(120px, 1fr))']}
            rowGap="30px"
            columnGap="30px"
          >
            {createNullArrayOfLength(twentyFourWordMode ? 24 : 12).map((_, i) => (
              <MnemonicWordInput
                index={i}
                key={i}
                value={mnemonic[i] ?? ''}
                onPasteEntireKey={key => {
                  (document.activeElement as any)?.blur();
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
    </CenteredPageContainer>
  );
}
