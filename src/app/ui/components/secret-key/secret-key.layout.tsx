import { useState } from 'react';

import { OnboardingSelectors } from '@tests/selectors/onboarding.selectors';
import { SettingsSelectors } from '@tests/selectors/settings.selectors';
import { Flex, HStack, Stack, styled } from 'leather-styles/jsx';

import { Button, CopyIcon, Eye1ClosedIcon, Eye1Icon } from '@leather.io/ui';

import { SecretKeyGrid } from './secret-key-grid';
import { SecretKeyWord } from './secret-key-word';

interface SecretKeyLayoutProps {
  hasCopied: boolean;
  onCopyToClipboard(): void;
  secretKeyWords: string[] | undefined;
  showTitleAndIllustration: boolean;
  onBackedUpSecretKey(): void;
}
export function SecretKeyLayout({
  hasCopied,
  onCopyToClipboard,
  onBackedUpSecretKey,
  secretKeyWords,
}: SecretKeyLayoutProps) {
  const [showSecretKey, setShowSecretKey] = useState(false);

  return (
    <Stack gap="space.05">
      <SecretKeyGrid>
        {secretKeyWords?.map((word, index) => (
          <SecretKeyWord
            key={word}
            word={showSecretKey ? word : '*'.repeat(word.length)}
            num={index + 1}
          />
        ))}
      </SecretKeyGrid>
      <Flex gap="space.04" direction={{ base: 'column', md: 'row' }}>
        <Button
          fullWidth
          variant="outline"
          flex="1"
          display="flex"
          p="space.03"
          justifyContent="center"
          alignItems="center"
          data-testid={SettingsSelectors.ShowSecretKeyBtn}
          onClick={() => setShowSecretKey(!showSecretKey)}
        >
          <HStack>
            {showSecretKey ? <Eye1ClosedIcon /> : <Eye1Icon />}
            <styled.span textStyle="label.02">
              {showSecretKey ? 'Hide key' : 'Show key'}
            </styled.span>
          </HStack>
        </Button>
        <Button
          fullWidth
          variant="outline"
          flex="1"
          display="flex"
          p="space.03"
          justifyContent="center"
          alignItems="center"
          data-testid={SettingsSelectors.CopyKeyToClipboardBtn}
          onClick={!hasCopied ? onCopyToClipboard : undefined}
        >
          <HStack>
            <CopyIcon />
            <styled.p textStyle="body.02">{!hasCopied ? ' Copy' : 'Copied!'}</styled.p>
          </HStack>
        </Button>
      </Flex>
      <Button
        width="100%"
        data-testid={OnboardingSelectors.BackUpSecretKeyBtn}
        onClick={onBackedUpSecretKey}
        variant="solid"
      >
        I've backed it up
      </Button>
    </Stack>
  );
}
