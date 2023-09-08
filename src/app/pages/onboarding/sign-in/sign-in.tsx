import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// #4164 FIXME migrate Input
import { Input } from '@stacks/ui';
import { OnboardingSelectors } from '@tests/selectors/onboarding.selectors';
import { Grid } from 'leather-styles/jsx';
import { Box, Flex, Stack, styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';
import { useFocus } from 'use-events';

import { RouteUrls } from '@shared/route-urls';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { createNullArrayOfLength, extractPhraseFromString } from '@app/common/utils';
import { LeatherButton } from '@app/components/button/button';
import { ErrorLabel } from '@app/components/error-label';
import { Header } from '@app/components/header';
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
    <Flex alignItems="center">
      <styled.span textStyle="label.02" mr="space.02">
        {index + 1}.
      </styled.span>
      <Input
        type={isFocused ? 'text' : 'password'}
        _focus={{ border: `1px solid ${token('colors.brown.12')}` }}
        value={value}
        autoCapitalize="off"
        spellCheck={false}
        autoComplete="off"
        data-testid={`mnemonic-input-${index}`}
        onPaste={(e: React.ClipboardEvent<HTMLElement>) => {
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
    </Flex>
  );
}

export function SignIn() {
  const { submitMnemonicForm, error, isLoading } = useSignIn();
  const navigate = useNavigate();

  const [twentyFourWordMode, setTwentyFourWordMode] = useState(true);

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
    <Flex
      flexDirection={['column', 'column', 'column', 'row']}
      mt={['space.05', 'space.06']}
      pb="space.05"
      px={['space.05', 'space.05', 'space.11']}
      width="100%"
      gap={['space.03', 'space.09']}
    >
      <Stack flex="1" gap="space.06">
        <styled.h1 textStyle={['heading.03', 'display.02']}>Sign in with your Secret Key</styled.h1>
        <Box>
          <styled.p textStyle={['label.01', 'heading.05']} mb="space.02">
            Enter your Secret Key to sign in with an existing wallet
          </styled.p>

          <styled.span textStyle="body.02">
            Tip: You can paste in your entire Secret Key at once
          </styled.span>
        </Box>
        <LeatherButton
          mt="space.03"
          variant="link"
          textStyle="caption.01"
          width="fit-content"
          onClick={() => {
            setTwentyFourWordMode(!twentyFourWordMode);
            setMnemonic(createNullArrayOfLength(twentyFourWordMode ? 24 : 12));
          }}
        >
          {twentyFourWordMode ? 'Have a 12-word Secret Key?' : 'Use 24 word Secret Key'}
        </LeatherButton>
      </Stack>
      <Stack
        borderRadius="16px"
        backgroundColor="brown.1"
        px={['', 'space.05']}
        pt={['space.02', 'space.07']}
        pb={['space.02', 'space.05']}
        flex="1"
        gap="space.04"
        width="100%"
      >
        <styled.h2 textStyle="heading.03" mb="space.04" hideBelow="sm" textAlign="center">
          Your Secret Key
        </styled.h2>
        <Stack gap="space.03" mb="space.05">
          <Grid
            mx="space.04"
            gridTemplateColumns={['repeat(2, minmax(30%, 1fr))', 'repeat(3, minmax(120px, 1fr))']}
            rowGap="15px"
            columnGap="15px"
          >
            {createNullArrayOfLength(twentyFourWordMode ? 24 : 12).map((_, i) => (
              <MnemonicWordInput
                index={i}
                key={i}
                value={mnemonic[i] ?? ''}
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
            <ErrorLabel mb="space.05" alignItems="center">
              <styled.p data-testid="sign-in-seed-error" pr="space.06" textStyle="caption">
                {error}
              </styled.p>
            </ErrorLabel>
          )}
          <LeatherButton
            data-testid={OnboardingSelectors.SignInBtn}
            aria-disabled={isLoading}
            aria-busy={isLoading}
            width="100%"
            onClick={e => {
              e.preventDefault();
              void submitMnemonicForm(mnemonic.join(' '));
            }}
          >
            Continue
          </LeatherButton>
        </Flex>
      </Stack>
    </Flex>
  );
}
