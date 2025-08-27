import { useState } from 'react';

import { OnboardingSelectors } from '@tests/selectors/onboarding.selectors';
import { SettingsSelectors } from '@tests/selectors/settings.selectors';
import { Flex, Stack } from 'leather-styles/jsx';

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
          variant="outline"
          iconStart={showSecretKey ? Eye1ClosedIcon : Eye1Icon}
          flex="1"
          p="space.03"
          data-testid={SettingsSelectors.ShowSecretKeyBtn}
          onClick={() => setShowSecretKey(!showSecretKey)}
        >
          {showSecretKey ? 'Hide key' : 'Show key'}
        </Button>
        <Button
          variant="outline"
          iconStart={CopyIcon}
          flex="1"
          p="space.03"
          data-testid={SettingsSelectors.CopyKeyToClipboardBtn}
          onClick={!hasCopied ? onCopyToClipboard : undefined}
        >
          {!hasCopied ? ' Copy' : 'Copied!'}
        </Button>
      </Flex>
      <Button
        variant="solid"
        fullWidth
        data-testid={OnboardingSelectors.BackUpSecretKeyBtn}
        onClick={onBackedUpSecretKey}
      >
        I've backed it up
      </Button>
    </Stack>
  );
}
